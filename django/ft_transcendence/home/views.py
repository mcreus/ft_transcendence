from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, TournamentForm, SignupForm
from django.http import JsonResponse
from home.models import Tournament

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

def salon_view(request):
    return render(request, 'salon.html')

def local_view(request):
    return render(request, 'local.html')

@login_required
def tournaments_view(request):
    t = Tournament.objects.all()
    return render(request, 'tournaments.html', {'tournaments': t})

@login_required
def tournament_create(request):
    form = TournamentForm()
    t = Tournament.objects.all()
    if request.method == 'POST':
        form = TournamentForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'tournaments.html', {'tournaments': t})
    return render(request, 'create_tournament.html', {'form': form}) 
    
def game_view(request):
    return render(request, 'game.html')
