from django.contrib import admin

from home.models import User
from home.models import Tournament

class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'subscribe_active', 'number_registered')

# Register your models here.
admin.site.register(User)
admin.site.register(Tournament, TournamentAdmin)
