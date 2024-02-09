from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from home.models import Tournament, User
from django.core.validators import RegexValidator

class LoginForm(forms.Form):
    username = forms.CharField(max_length=63, label='Nom d’utilisateur')
    password = forms.CharField(max_length=63, widget=forms.PasswordInput, label='Mot de passe')


class SignupForm(UserCreationForm):
	username = forms.CharField(
		max_length=20,
		label="Pseudo",
		help_text="Maximum 20 caracteres, uniquement lettre, chiffre et @, -, _ ",
		validators=[
			RegexValidator(
				regex='^[a-zA-Z0-9@\-_]+$', 
				message="Le nom d'utilisateur peut seulement contenir des lettres, des chiffres, et les caractères @, -, _"
			)
		]
	)
	
	email = forms.CharField(
		label="Adresse Email",
	)
	password2 = forms.CharField(
		widget=forms.PasswordInput(attrs={'placeholder': ''}),
		label="Confirmation du mot de passe",
    )

	class Meta:
		model = User
		fields = ('username', 'email')

class TournamentForm(forms.ModelForm):
   class Meta:
     model = Tournament
     fields = ['name', 'time_to_subscribe', 'max_player']

class add_friendForm(forms.Form):
    pseudo_ami = forms.CharField(label="Pseudo de l'ami à ajouter")

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(add_friendForm, self).__init__(*args, **kwargs)
        self.fields['pseudo_ami'].queryset = User.objects.exclude(pk=user.pk)
     
class update_usernameForm(forms.ModelForm):
	username = forms.CharField(
		max_length=20,
		label="Pseudo",
		help_text="Maximum 20 caracteres, uniquement lettre, chiffre et @, -, _ ",
		validators=[
			RegexValidator(
				regex='^[a-zA-Z0-9@\-_]+$', 
				message="Le nom d'utilisateur peut seulement contenir des lettres, des chiffres, et les caractères @, -, _"
			)
		]
	)

	class Meta:
		model = User
		fields = ['username']
        
class update_emailForm(forms.ModelForm):
	email = forms.CharField(
		label="Adresse Email",
	)

	class Meta:
		model = User
		fields = ['email']
        
class update_imageForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['profile_photo']
