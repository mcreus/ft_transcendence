from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, TournamentForm, SignupForm, update_usernameForm, update_emailForm, update_imageForm
from django.http import JsonResponse
from home.models import Tournament
from home.models import Match
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User

def main(request):
    return render(request, 'index.html')

def lobby(request):
    return render(request, 'lobby.html')

def login_view(request):
    form = LoginForm()
    message = ''

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
    logout(request)
    return render(request, 'index.html')

def signup_view(request):
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
    return render(request, 'profile.html')
    
@login_required
def update_username(request):
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
    if request.method == 'POST':
        form = update_imageForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            user = form.save()
            return render(request, "index.html")
    else:
        form = update_imageForm(instance=request.user)

    return render(request, 'update_image.html', {'form': form})

def salon_view(request):
    return render(request, 'salon.html')

def local_view(request):
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
    t = Tournament.objects.all()
    return render(request, 'tournaments.html', {'tournaments': t})

@login_required
def tournament_detail(request, id):
    t = Tournament.objects.get(id=id)
    if request.method == 'POST':
        if request.user.username in t.get_registered_players():
            t.remove_player(request.user.username)
            t.number_registered -= 1
        else:
            t.add_player(request.user.username)
            t.number_registered += 1
            if t.number_registered == t.max_player:
                t.subscribe_active = False
        t.save()
    return render(request, 'tournament_detail.html', {'tournament': t})

@login_required
def tournament_create(request):
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
        elif delete == '1':
            t.delete()
            ts = Tournament.objects.all()
            return render(request, 'tournaments.html', {'tournaments': ts})
        t.save()
    return render(request, 'tournament_update.html', {'tournament': t, 'message': message})

def match_details(request, id):
    m = Match.objects.get(id=id)
    return render(request, 'match_details.html', {'match': m})

@login_required
def historic(request):
    m = request.user.historic.all()
    return render(request, 'historic.html', {'matchs': m})

def fast_game(request):
    if request.method == 'POST':
        play1 = request.POST.get('player1')
        play2 = request.POST.get('player2')

        match = Match.objects.create(
            #host=request.user,
            player1_name=play1,
            player2_name=play2
        )
        return  render(request, 'start_game.html')

    return render(request, 'fast_game.html')
