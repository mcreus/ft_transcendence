# home/models.pyWebSocket.js:27:12
import os
import json
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from channels.layers import get_channel_layer

class   Match(models.Model):
    player1_name = models.fields.CharField(max_length=100, default='player 1')
    player1_score = models.fields.IntegerField(default=0)
    player2_name = models.fields.CharField(max_length=100, default='player 2')
    player2_score = models.fields.IntegerField(default=0)
    from_tournament = models.fields.BooleanField(default=True)
    origin = models.ForeignKey('Tournament', on_delete=models.SET_NULL, null=True)
    played = models.fields.BooleanField(default=False)
    winner = models.fields.CharField(max_length=100, default='')
    players = models.TextField(blank=True)

    def add_player(self, player_name):
        listing = self.players.split(',')
        if player_name in listing:
            return
        if len(self.players) > 0:
            self.players += f',{player_name}'  # Ajout du nom du joueur à la liste
        else:
            self.players = player_name
        self.save()

    def remove_player(self, player_name):
        listing = self.players.split(',')
        if player_name in listing:
            listing.remove(player_name)
            if len(listing) > 0:
                self.players = ','.join(listing)  # Mise à jour de la liste des joueurs
            else:
                self.players = ''
            self.save()

    def matchmaking(self):
        listing = self.players.split(',')
        if len(listing) <= 1:
            return
        return self

class User(AbstractUser):
    historic = models.ManyToManyField(Match, related_name='historic', blank=True)
    waiting_match = models.ForeignKey(Match, on_delete=models.SET_NULL, null=True)
    amis = models.ManyToManyField('User', blank=True)
    banlist = models.TextField(blank=True)
    status = models.TextField(blank=True, default='offline')
    profile_photo = models.ImageField(
        verbose_name='Photo de profil',
    )

    def exit_match(self):
        if self.waiting_match is not None:
            self.waiting_match.remove_player(self.username)
            self.waiting_match = None
            self.save()

    def ban(self, name):
        listing = self.banlist.split(',')
        if name not in listing:
            self.banlist += f'{name},'
            self.save()

    def unban(self, name):
        print(name)
        listing = self.banlist.split(',')
        if name in listing:
            listing.remove(name)
            self.banlist = ','.join(listing)
            self.save()

class ChatConsumer(WebsocketConsumer):
    master = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    def connect(self):
        self.user = self.scope["user"].username
        self.room_group_name = 'test'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        users = User.objects.all()
        usernames = [user.username for user in users]
        if self.user in usernames:
            master = User.objects.get(username=self.user)
            master.status = 'online'
            master.save()
            async_to_sync(self.channel_layer.group_send)(
                 self.room_group_name,
                 {
                     'type':'status_message',
                     'status':'online',
                     'target':self.user
                 }
            )
        self.accept()
    def disconnect(self, close_code):
        users = User.objects.all()
        usernames = [user.username for user in users]
        if self.user in usernames:
            user = User.objects.get(username=self.user)
            user.exit_match()
            user.status = 'offline'
            user.save()
            if WaitingList.objects.all():
                WaitingList.objects.all().first().remove_player(self.user)
        pass
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if (text_data_json['type'] == 'chat' and self.user):
            message = text_data_json['message']
            if (message[0] == '/'):
            	if (message.find('unban') > -1 or message.find('UNBAN') > -1):
            	    name = message[7:]
            	    User.objects.get(username=self.user).unban(name)
            	elif (message.find('ban') > -1 or message.find('BAN') > -1):
            	    name = message[5:]
            	    User.objects.get(username=self.user).ban(name)
            	elif (message.find('game') > -1 or message.find('Game') > -1):
            	    name = message[6:]
            	    m = Match.objects.create(player1_name=self.user, player2_name=name)
            	    m.add_player(self.user)
            	    async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type':'game_message',
                        'target':name,
                        'player':self.user,
                        'id':m.id
                    }
                )
            else:
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type':'chat_message',
                        'message':message,
                        'pseudo':self.user
                    }
                )
        if (text_data_json['type'] == 'player_pos'):
            player = text_data_json['player']
            nb = text_data_json['id']
            pseudo = text_data_json['target']
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type':'player_pos_message',
                    'id':nb,
                    'player':player,
                    'target':pseudo
                }
            )
        if (text_data_json['type'] == 'ball_pos'):
            ball = text_data_json['ball']
            nb = text_data_json['id']
            pseudo = text_data_json['target']
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type':'ball_pos_message',
                    'id':nb,
                    'ball':ball,
                    'target':pseudo
                }
            )
        if (text_data_json['type'] == 'start_match'):
            player1 = text_data_json['player1']
            player2 = text_data_json['player2']
            async_to_sync(self.channel_layer.group_send)(
                 self.room_group_name,
                 {
                     'type':'start_match_message',
                     'player1':player1,
                     'player2':player2,
                     'tournament':text_data_json['tournament']
                 }
            )
        if (text_data_json['type'] == 'status'):
            async_to_sync(self.channel_layer.group_send)(
                 self.room_group_name,
                 {
                     'type':'status_message',
                     'status':text_data_json['status'],
                     'target':text_data_json['target']
                 }
            )
        if (text_data_json['type'] == 'ping'):
            async_to_sync(self.channel_layer.group_send)(
                 self.room_group_name,
                 {
                     'type':'ping_message',
                     'ping':text_data_json['ping'],
                     'target':text_data_json['target']
                 }
            )
        if (text_data_json['type'] == 'test_ping'):
            async_to_sync(self.channel_layer.group_send)(
                 self.room_group_name,
                 {
                     'type':'test_ping_message',
                     'target':text_data_json['target']
                 }
            )
        if (text_data_json['type'] == 'alert'):
            async_to_sync(self.channel_layer.group_send)(
                 self.room_group_name,
                 {
                     'type':'alert_message',
                     'target':text_data_json['target'],
                     'player':text_data_json['player'],
                     'id':text_data_json['id']
                 }
            )

    def chat_message(self, event):
        listing = User.objects.get(username=self.user).banlist.split(',')
        message = event['message']
        pseudo = event['pseudo']
        if pseudo in listing:
            return
        self.send(text_data = json.dumps({
            'type':'chat',
            'message':message,
            'pseudo':pseudo
        }))
    def player_pos_message(self, event):
        player = event['player']
        nb = event['id']
        if (self.user == event['target']):
            self.send(text_data = json.dumps({
                'type':'player_pos',
                'id':nb,
                'player':player
            }))
    def ball_pos_message(self, event):
        ball = event['ball']
        nb = event['id']
        if (self.user == event['target']):
            self.send(text_data = json.dumps({
                'type':'ball_pos',
                'id':nb,
                'ball':ball
            }))
    def start_match_message(self, event):
        player1 = event['player1']
        player2 = event['player2']
        if (self.user == player1 or self.user == player2):
            self.send(text_data = json.dumps({
                 'type':'start_match',
                 'player1':player1,
                 'player2':player2,
                 'tournament':event['tournament']
            }))
    def status_message(self, event):
        self.send(text_data = json.dumps({
            'type':'status',
            'status':event['status'],
            'target':event['target']
        }))
    def ping_message(self, event):
        if (self.user == event['target']):
            self.send(text_data = json.dumps({
                 'type':'ping',
                 'ping':event['ping']
            }))
    def test_ping_message(self, event):
        if (self.user == event['target']):
            self.send(text_data = json.dumps({
                 'type':'test_ping'
            }))
    def alert_message(self, event):
        if (self.user == event['target']):
            self.send(text_data = json.dumps({
                 'type':'alert',
                 'target':event['player'],
                 'id':event['id']
            }))
    def game_message(self, event):
        if (self.user == event['target']):
            self.send(text_data = json.dumps({
                 'type':'game',
                 'target':event['player'],
                 'id':event['id']
            }))


@receiver(post_save, sender=User)
def assign_default_profile_photo(sender, instance, created, **kwargs):
    if created and not instance.profile_photo:
        instance.profile_photo = 'no_image.png'
        instance.save()

class Tournament(models.Model):

    TIME_CHOICES = [
            (5, '5m'),
            (10, '10m'),
            (15, '15m'),
        (20, '20m'),
        (25, '25m'),
        (30, '30m'),
    ]
    PLAYERS_CHOICES = [
        (4, '4'),
        (8, '8'),
        (16, '16'),
        (32, '32'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.fields.CharField(max_length=100)
    subscribe_active = models.fields.BooleanField(default=True)
    running = models.fields.BooleanField(default=False)
    time_to_subscribe = models.fields.IntegerField(choices=TIME_CHOICES, default=15)
    max_player = models.fields.IntegerField(choices=PLAYERS_CHOICES, default=4)
    number_registered = models.fields.IntegerField(default=1)
    players_registered = models.TextField(blank=True)
    remaining_players = models.TextField(blank=True)
    all_match = models.ManyToManyField(Match, related_name='all_match')
    remaining_match = models.ManyToManyField(Match, related_name='remaining_match')
    start_date = models.DateTimeField(default=timezone.now)
    winner = models.fields.CharField(max_length=100, default='')

    def time_left_in_minutes(self):
        end_date = self.start_date + timezone.timedelta(minutes=self.time_to_subscribe)
        time_left = (end_date - timezone.now()).total_seconds() / 60
        if time_left <= 0:
            self.subscribe_active = False
            self.save()
        return max(0, int(time_left))


    def add_player(self, player_name):
            self.players_registered += f',{player_name}'  # Ajout du nom du joueur à la liste

    def remove_player(self, player_name):
        players = self.players_registered.split(',')
        if player_name in players:
            players.remove(player_name)
            self.players_registered = ','.join(players)  # Mise à jour de la liste des joueurs

    def get_registered_players(self):
        if self.players_registered:
            return self.players_registered.split(',')
        else:
            return []

    def launch_tournament(self):
        self.running = True
        self.subscribe_active = False
        self.remaining_players = self.players_registered
        self.matchmaking_tournament()
        self.save()
        return

    def matchmaking_tournament(self):
        listing = self.remaining_players.split(',')

        if len(listing) == 1:
            self.winner = listing[0]
            self.save()
            return

        if len(listing) % 2 != 0:
            last_player = listing.pop()
            self.remaining_players = last_player
        else:
            self.remaining_players = ''

        i = 0
        while i < len(listing) - 1:
            p1 = listing[i]
            p2 = listing[i + 1]
            m = Match.objects.create(player1_name=p1, player2_name=p2, origin=self)
            self.all_match.add(m)
            self.remaining_match.add(m)
            i += 2
        self.save()

class WaitingList(models.Model):

    players = models.TextField(blank=True)

    def add_player(self, player_name):
        listing = self.players.split(',')
        if player_name in listing:
            return
        if len(self.players) > 0:
            self.players += f',{player_name}'  # Ajout du nom du joueur à la liste
        else:
            self.players = player_name
        self.save()

    def remove_player(self, player_name):
        listing = self.players.split(',')
        if player_name in listing:
            listing.remove(player_name)
            if len(listing) > 0:
                self.players = ','.join(listing)  # Mise à jour de la liste des joueurs
            else:
                self.players = ''
            self.save()

    def matchmaking(self):
        listing = self.players.split(',')
        if len(listing) <= 1:
            return
        p1 = listing[0]
        p2 = listing[1]
        m = Match.objects.create(player1_name=p1, player2_name=p2)
        self.remove_player(p1)
        self.remove_player(p2)
        return m

