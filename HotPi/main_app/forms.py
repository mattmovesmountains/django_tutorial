from django import forms
from main_app.models import Comment

class FormName(forms.Form):
    name = forms.CharField()
    email = forms.EmailField()
    

class CommentForm(forms.ModelForm):

    class Meta():
        model = Comment
        fields = ('author', 'text')

        # Maybe go back and add widgets
        widgets = {
            'author':forms.TextInput(attrs={'class':'comment-background'}),
            'text':forms.Textarea(attrs={'class':'comment-background'})
        }