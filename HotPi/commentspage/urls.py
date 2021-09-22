from django.conf.urls import url 
from commentspage import views


urlpatterns = [
    url(r'^$', views.comment_views, name='comments'),
]