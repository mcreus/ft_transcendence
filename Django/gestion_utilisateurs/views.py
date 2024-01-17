from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import generic
from .forms import CustomUserCreationForm
from .forms import CustomUserChangeForm
from .forms import CustomUserLoginForm
from django.contrib.auth.views import LoginView
from django.http import JsonResponse
from django.contrib.auth import login

def home(request):
    return render(request, 'index.html')

class SignUpView(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = 'login'  # Rediriger vers la page de connexion après l'inscription
    template_name = 'signup.html'

class UpdateProfileView(generic.UpdateView):
    form_class = CustomUserChangeForm
    template_name = 'profile_update.html'
    success_url = reverse_lazy('profile')  # Rediriger vers la page de profil après la mise à jour

    def get_object(self):
        return self.request.user

class CustomLoginView(LoginView):
    form_class = CustomUserLoginForm
    template_name = 'login.html'

    def form_invalid(self, form):
        response = super().form_invalid(form)
        if self.request.is_ajax():
            return JsonResponse({'error': True, 'errors': form.errors})
        else:
            return response

    def form_valid(self, form):
        login(self.request, form.get_user())
        return JsonResponse({'error': False})
