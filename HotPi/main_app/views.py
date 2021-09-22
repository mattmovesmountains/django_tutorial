from django.shortcuts import render
from django.http import HttpResponse
from . import forms
from django.core.exceptions import ValidationError
from django.shortcuts import redirect

# Create your views here.

# Goal here is to get the home page to be a form, and once that's 
# filled out, it takes you to the Hot Pi page. This is a little 
# different from the setup in anything I worked on, but hopefully 
# just a few name changes will do the trick?
def hot_pi_view(request):
    return render(request, 'main_app_templates/hot_pi.html')

form_view_counter = 0
def form_view(request):
    global form_view_counter
    form = forms.FormName()
    if request.method == 'POST':
        form = forms.FormName(request.POST)
        print(form_view_counter)

        
        if form.is_valid():
            yourname = form.cleaned_data['name']
            youremail = form.cleaned_data['email']
            if yourname=='Matt' and youremail=='mattyb955@gmail.com':
                return render(request, 'main_app_templates/hot_pi.html')
            else:
                form_view_counter+=1
                if form_view_counter < 3:
                    return render(request, 'main_app_templates/form_page.html', {'form':forms.FormName()})
                else:
                    form_view_counter = 0
                    return render(request, 'main_app_templates/only_one.html')

    return render(request, 'main_app_templates/form_page.html', {'form' : form})

def relative_url_view(request):
    return render(request, 'main_app_templates/relative_URL_notes.html')

def django_notes(request):
    return render(request, 'main_app_templates/django_notes.html')

def django_models(request):
    return render(request, 'main_app_templates/django_models.html')

def django_forms(request):
    return render(request, 'main_app_templates/django_forms.html')

def django_authentication(request):
    return render(request, 'main_app_templates/django_auth.html')

def django_deployment(request):
    return render(request, 'main_app_templates/django_deploy.html')

    