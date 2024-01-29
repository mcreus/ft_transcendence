"""
URL configuration for ft_transcendence project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from home import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.signup_view, name='signup'),
    path('profile/', views.profile, name='profile'),
    path('salon/', views.salon_view, name='salon'),
    path('local/', views.local_view, name='local'),
    path('tournaments/', views.tournaments_view, name='tournaments'),
    path('tournaments/create/', views.tournament_create, name='tournaments/create'),
    path('profile/email/', views.update_email, name="profile/email"),
    path('profile/username/', views.update_username, name="profile/username"),
    path('profile/password/', views.update_password, name="profile/password"),
]