from django.conf.urls import url 
from main_app import views

# For template tagging
app_name = 'main_app'

# If any '/django' extension is used, it'll map us to this urls file
urlpatterns = [
    url(r'^notes/$', views.django_notes, name='notes'),
    url(r'^models/$', views.django_models, name='models'),
    url(r'^forms/$', views.django_forms, name='forms'),
    url(r'^relative/$', views.relative_url_view, name='relative'),
    url(r'^authentication/$', views.django_authentication, name='djangoauth'),
    url(r'^deployment/$', views.django_deployment, name='djangodeploy'),
]