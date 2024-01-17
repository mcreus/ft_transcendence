from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    photo_profil = models.ImageField(upload_to='photos_profil/', null=True, blank=True)
