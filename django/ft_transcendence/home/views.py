from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login, authenticate # import des fonctions login et authenticate
from .forms import LoginForm
from django.http import JsonResponse

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
                message = f'Bonjour, {user.username}! Vous êtes connecté.'
            else:
                message = 'Identifiants invalides.'
    
    return render(request, 'login.html', context={'form': form, 'message': message})

