from django.db import models
from django.utils import timezone

# Create your models here.
class Comment(models.Model):

    author = models.CharField(max_length=250)
    text = models.TextField()
    create_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.text