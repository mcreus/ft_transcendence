from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from home.models import Tournament, User

class LoginForm(forms.Form):
    username = forms.CharField(max_length=63, label='Nom d’utilisateur')
    password = forms.CharField(max_length=63, widget=forms.PasswordInput, label='Mot de passe')


class SignupForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = get_user_model()
        fields = ('username', 'email')

class TournamentForm(forms.ModelForm):
   class Meta:
     model = Tournament
     fields = '__all__'
     
class update_usernameForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username']
        
class update_emailForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email']
