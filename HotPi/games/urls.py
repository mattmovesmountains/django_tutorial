#========================================================
# This is the URLs file for the GAMES app
# When user types extensions starting with "/games", the 
# main URLs file will map to this one
#========================================================

from django.conf.urls import url 
from games import views

app_name = 'games'

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^spaceinvaders/$', views.space_invaders, name='invaders'),
    url(r'^asteroids/$', views.asteroids, name='asteroids'),
    url(r'^starwars/$', views.star_wars_mando, name='starwars'),
    url(r'^asteroids/about/$', views.asteroids_about, name='asteroids_about')
]