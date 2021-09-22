from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'games_templates/index.html')

def space_invaders(request):
    return render(request, 'games_templates/spaceinvaders.html')

def asteroids(request):
    return render(request, 'games_templates/jsTeroids.html')

def asteroids_about(request):
    return render(request, 'games_templates/jsTeroidsWriteUp.html')

def star_wars_mando(request):
    return render(request, 'games_templates/star_wars_mando.html')

