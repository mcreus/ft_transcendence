from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, TournamentForm, SignupForm, update_usernameForm, update_emailForm, update_imageForm, add_friendForm
from django.http import JsonResponse
from home.models import Tournament, Match, WaitingList
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from home.models import User
from django.contrib import messages

def main(request):
    if request.user.is_authenticated:
        request.user.exit_match()
        if WaitingList.objects.all():
            WaitingList.objects.all().first().remove_player(request.user.username)
    return render(request, 'index.html')

def login_view(request):
    form = LoginForm()
    message = ''
    if request.user.is_authenticated:
        request.user.exit_match()
        if WaitingList.objects.all():
            WaitingList.objects.all().first().remove_player(request.user.username)
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = authenticate(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password'],
            )
            if user is not None:
                login(request, user)
                return render(request, 'index.html')
            else:
                message = 'Identifiants invalides.'

    return render(request, 'login.html', context={'form': form, 'message': message})

def logout_view(request):
    if request.user.is_authenticated:
        request.user.exit_match()
        if WaitingList.objects.all():
            WaitingList.objects.all().first().remove_player(request.user.username)
    logout(request)
    return render(request, 'index.html')

def signup_view(request):
    if request.user.is_authenticated:
        request.user.exit_match()
        if WaitingList.objects.all():
            WaitingList.objects.all().first().remove_player(request.user.username)
    form = SignupForm()
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            # auto-login user
            login(request, user)
            return render(request, 'index.html')
    return render(request, 'signup.html', context={'form': form})

@login_required
def profile(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    return render(request, 'profile.html')

@login_required
def otherProfile(request, id):
	request.user.exit_match()
	if WaitingList.objects.all():
		WaitingList.objects.all().first().remove_player(request.user.username)
	u = User.objects.get(username=id)
	is_friend = request.user.amis.filter(username=u.username).exists()
	if request.method == 'POST':
		add = request.POST.get('addfriend')
		remove = request.POST.get('removefriend')
		if add == '1':
			friend_to_add = User.objects.get(username= id)
			request.user.amis.add(friend_to_add)
		elif remove == '1':
			friend_delete = User.objects.get(username = id)
			request.user.amis.remove(friend_delete)
		return  render(request, 'index.html')
	return render(request, 'otherProfile.html', {'u' : u, 'is_friend': is_friend})

@login_required
def update_username(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    if request.method == 'POST':
        form = update_usernameForm(request.POST, instance=request.user)
        if form.is_valid():
            user = form.save()
            return render(request, 'index.html')
    else:
        form = update_usernameForm(instance=request.user)

    return render(request, 'update_username.html', {'form': form})

@login_required
def update_email(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    if request.method == 'POST':
        form = update_emailForm(request.POST, instance=request.user)
        if form.is_valid():
            user = form.save()
            return render(request, 'index.html')
    else:
        form = update_emailForm(instance=request.user)

    return render(request, 'update_email.html', {'form': form})

@login_required
def update_password(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            return render(request, 'index.html')
    else:
        form = PasswordChangeForm(request.user)

    return render(request, 'update_password.html', {'form': form})

@login_required
def update_image(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    if request.method == 'POST':
        form = update_imageForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            user = form.save()
            return render(request, "index.html")
    else:
        form = update_imageForm(instance=request.user)

    return render(request, 'update_image.html', {'form': form})

@login_required
def add_friend(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    amis_actuels = request.user.amis.all()
    message = ""
    if request.method == 'POST':
        message = "Cet utilisateur est deja dans la liste d'amis"
        form = add_friendForm(request.POST, user=request.user)
        if form.is_valid():
            pseudo_ami = form.cleaned_data['pseudo_ami']
            if pseudo_ami == request.user.username:
                message = "Mais, c'est vous"
                return render(request, "add_friend.html", {'form': form, 'amis':amis_actuels, 'error': message})
            try:
                ami = User.objects.get(username=pseudo_ami)
                if ami != request.user and ami not in request.user.amis.all():
                    request.user.amis.add(ami)
            except User.DoesNotExist:
                message = "L'utilisateur spécifié n'existe pas."
            form = add_friendForm(user=request.user)
            return render(request, "add_friend.html", {'form': form, 'amis':amis_actuels, 'error': message})
        else:
            return render(request, 'add_friend.html', {'form': form, 'amis':amis_actuels, 'error': ""})
    else:
        form = add_friendForm(user=request.user)
    return render(request, 'add_friend.html', {'form': form, 'amis':amis_actuels, 'error': message})

def salon_view(request):
    if request.user.is_authenticated:
        request.user.exit_match()
        if WaitingList.objects.all():
            WaitingList.objects.all().first().remove_player(request.user.username)
    return render(request, 'salon.html')

def local_view(request):
    if request.user.is_authenticated:
        request.user.exit_match()
        if WaitingList.objects.all():
            WaitingList.objects.all().first().remove_player(request.user.username)
    if request.method == 'POST':
        play1 = request.POST.get('player1')
        play2 = request.POST.get('player2')
        score1 = request.POST.get('score1')
        score2 = request.POST.get('score2')
        win = request.POST.get('winner')

        if request.user.is_authenticated:
            match = Match.objects.create(
                player1_name=play1,
                player2_name=play2,
                player1_score = score1,
                player2_score = score2,
                from_tournament = False,
                played = True,
                winner = win
            )
            request.user.historic.add(match)
        return  render(request, 'index.html')

    return render(request, 'local.html')

@login_required
def tournaments_view(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    t = Tournament.objects.all()
    return render(request, 'tournaments.html', {'tournaments': t})

@login_required
def tournament_detail(request, id):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    t = Tournament.objects.get(id=id)
    if request.method == 'POST':
        if request.user.username in t.get_registered_players():
            t.remove_player(request.user.username)
            t.number_registered -= 1
            if t.time_left_in_minutes() > 0:
                t.subscribe_active = True
        else:
            t.add_player(request.user.username)
            t.number_registered += 1
            if t.number_registered == t.max_player:
                t.subscribe_active = False
        t.save()
    r = t.get_registered_players()
    return render(request, 'tournament_detail.html', {'tournament': t, 'registered' : r})

@login_required
def tournament_create(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    form = TournamentForm()
    if request.method == 'POST':
        form = TournamentForm(request.POST)
        if form.is_valid():
            tournament = form.save(commit=False)
            tournament.owner = request.user
            tournament.players_registered = request.user.username
            tournament.save()
            return render(request, 'tournament_detail.html', {'tournament': tournament})
    return render(request, 'tournament_create.html', {'form': form})

@login_required
def tournament_update(request, id):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    message = ''
    t = Tournament.objects.get(id=id)
    if request.method == 'POST':
        new_p = request.POST.get('new_player')
        launch = request.POST.get('launch')
        remove = request.POST.get('remove')
        delete = request.POST.get('delete')
        if new_p:
            if '@' + new_p not in t.get_registered_players():
                t.add_player('@' + new_p)
                t.number_registered += 1
                if t.number_registered == t.max_player:
                    t.subscribe_active = False
            else:
                message = 'Ce joueur est deja inscrit !'
        elif launch == '1':
            t.launch_tournament()
        elif remove:
            t.remove_player(remove)
            t.number_registered -= 1
            if t.time_left_in_minutes() > 0:
                t.subscribe_active = True
        elif delete == '1':
            t.delete()
            ts = Tournament.objects.all()
            return render(request, 'tournaments.html', {'tournaments': ts})
        t.save()
    return render(request, 'tournament_update.html', {'tournament': t, 'message': message})

@login_required
def match_details(request, id):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    m = Match.objects.get(id=id)
    users = User.objects.all()
    usernames = [user.username for user in users]
    if request.method == 'POST':
        play1 = request.POST.get('player1')
        play2 = request.POST.get('player2')
        score1 = request.POST.get('score1')
        score2 = request.POST.get('score2')
        win = request.POST.get('winner')
        forced = request.POST.get('forced')
        if forced is None:
            m.player1_score = score1
            m.player2_score = score2
        else:
            win = forced
        m.winner = win
        m.played = True
        m.save()
        if request.user.username == play1 or request.user.username == play2:
            request.user.historic.add(m)
        m.origin.remaining_match.remove(m)
        if len(m.origin.remaining_players) == 0:
            m.origin.remaining_players = win
        else:
            m.origin.remaining_players += f',{win}'
        m.origin.save()
        if m.origin.remaining_match.count() == 0:
            m.origin.matchmaking_tournament()
        return render(request, 'tournament_detail.html', {'tournament': m.origin})

    m_type =''
    if m.player1_name == request.user.username:
        if m.player2_name not in usernames:
            m_type = 'local'
    elif m.player2_name == request.user.username:
        if m.player1_name not in usernames:
            m_type = 'local'
    elif m.player1_name not in usernames and m.player2_name not in usernames:
        m_type = 'local'
    elif m.player1_name in usernames or m.player2_name in usernames:
          m_type = 'not_mine'
    return render(request, 'match_details.html', {'match': m, 'type': m_type})

@login_required
def historic(request):
    request.user.exit_match()
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    m = request.user.historic.all()
    return render(request, 'historic.html', {'matchs': m})

@login_required
def fast_game(request):
    request.user.exit_match()
    if not WaitingList.objects.all():
       WaitingList.objects.create()
    waiting = WaitingList.objects.all().first()
    waiting.add_player(request.user.username)
    result = waiting.matchmaking()
    return render(request, 'fast_game.html', {'result': result})

@login_required
def tournament_online(request, id):
    if WaitingList.objects.all():
        WaitingList.objects.all().first().remove_player(request.user.username)
    m = Match.objects.get(id=id)
    m.add_player(request.user.username)
    result = m.matchmaking()
    request.user.waiting_match = m
    request.user.save()
    return render(request, 'fast_game.html', {'result': result})
