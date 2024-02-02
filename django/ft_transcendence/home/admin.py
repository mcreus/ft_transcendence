from django.contrib import admin

from home.models import User
from home.models import Tournament
from home.models import Match

class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'subscribe_active', 'number_registered')

class MatchAdmin(admin.ModelAdmin):
    list_display = ('player1_name', 'player1_score', 'player2_name', 'player2_score', 'winner')

# Register your models here.
admin.site.register(User)
admin.site.register(Match, MatchAdmin)
admin.site.register(Tournament, TournamentAdmin)
