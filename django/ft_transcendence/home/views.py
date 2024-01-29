from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, TournamentForm, SignupForm, update_usernameForm, update_emailForm
from django.http import JsonResponse
from home.models import Tournament
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User

def main(request):
    return render(request, 'index.html')


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

def salon_view(request):
    return render(request, 'salon.html')

def local_view(request):
    return render(request, 'local.html')

def tournaments_view(request):
    t = Tournament.objects.all()
    return render(request, 'tournaments.html', {'tournaments': t})

def tournament_create(request):
    form = TournamentForm()
    t = Tournament.objects.all()
    if request.method == 'POST':
        form = TournamentForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'tournaments.html', {'tournaments': t})
    return render(request, 'create_tournament.html', {'form': form}) 
