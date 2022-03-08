from django.shortcuts import render
from django.http import HttpResponse
from . import forms
from django.core.exceptions import ValidationError
from django.shortcuts import redirect

from main_app.forms import CommentForm
from main_app.models import Comment

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
    
def django_cbv(request):
    return render(request, 'main_app_templates/django_cbv.html')

def django_blog(request):

    form = CommentForm()

    if request.method=='POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            author = form.cleaned_data['author']
            text = form.cleaned_data['text']
            #date = form.cleaned_data['create_date']
            print(author, text)
            form.save()
            comment_list = Comment.objects.all
            comment_dict = {
                'form':CommentForm(),
                'commentlist':comment_list,
                'commentauthor':author,
                'commenttext':text,
                #'date':date,
            }
            return render(request, 'main_app_templates/django_blog.html', context=comment_dict)
        else:
            form = CommentForm()

    return render(request, 'main_app_templates/django_blog.html', {
                'form':form,
                'commentlist':Comment.objects.order_by('create_date'),
            })

    