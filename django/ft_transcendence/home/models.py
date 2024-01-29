# home/models.py
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

class User(AbstractUser):   
    profile_photo = models.ImageField(verbose_name='Photo de profil')

class Tournament(models.Model):
    name = models.fields.CharField(max_length=100, null=True,)
    owner = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    active = models.fields.BooleanField(default=True)
    time_to_subscribe = models.fields.IntegerField(
    validators=[MinValueValidator(5), MaxValueValidator(30)]
    )
    max_player = models.fields.IntegerField(
    validators=[MinValueValidator(4), MaxValueValidator(20)]
    )
    players_registered = models.fields.IntegerField(default=1)