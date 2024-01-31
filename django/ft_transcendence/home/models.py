# home/models.py
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):   
    profile_photo = models.ImageField(verbose_name='Photo de profil')

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
    players_registered = models.ManyToManyField(User, related_name='tournaments_registered', blank=True)
    start_date = models.DateTimeField(default=timezone.now)

    def time_left_in_minutes(self):
        end_date = self.start_date + timezone.timedelta(minutes=self.time_to_subscribe)
        time_left = (end_date - timezone.now()).total_seconds() / 60
        if time_left <= 0:
            self.subscribe_active = False
            self.save()
        return max(0, int(time_left))
    
    def launch_tournament(self):
        self.running = True
        self.subscribe_active = False
        self.save()
        return