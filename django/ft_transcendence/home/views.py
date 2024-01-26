from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login, authenticate, logout
from .forms import LoginForm
from django.http import JsonResponse
from . import forms

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
    form = forms.SignupForm()
    if request.method == 'POST':
        form = forms.SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            # auto-login user
            login(request, user)
            return render(request, 'index.html')
    return render(request, 'signup.html', context={'form': form})

def profile(request):
    return render(request, 'profile.html')

def salon_view(request):
    return render(request, 'salon.html')

def local_view(request):
    return render(request, 'local.html')
    
def game_view(request):
    return render(request, 'game.html')
