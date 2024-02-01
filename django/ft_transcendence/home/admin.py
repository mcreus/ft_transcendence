from django.contrib import admin

from home.models import User
from home.models import Tournament
from home.models import Match

class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'subscribe_active', 'number_registered')

# Register your models here.
admin.site.register(User)
admin.site.register(Match)
admin.site.register(Tournament, TournamentAdmin)
