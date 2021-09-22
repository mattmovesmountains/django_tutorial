from django.shortcuts import render
from commentspage.models import Comment
from . import forms 

# Create your views here.
def comment_views(request):
    """What should happen here, is that Django will point to this view
    when a user types the '/comments' extension in the URL. This view 
    will pull up the comments.html page, which will have access to this
    variable: form, which is an instance of class:CommentForm()... which
    is a class that derives it's structure from the models.py class: Comment."""
    form = forms.CommentForm() 

    if request.method == 'POST':
        form = forms.CommentForm(request.POST)

        if form.is_valid():
            print("USERNAME: " + form.cleaned_data['username'])
            print("COMMENT: " + form.cleaned_data['comment'])
            html_username = form.cleaned_data['username']
            html_comment = form.cleaned_data['comment']
            form.save()
            comment_list = Comment.objects.order_by('username')
            comment_dict = {'form':form, 'html_username':html_username, 'html_comment':html_comment, 'commentlist':comment_list}
            return render(request, 'commentspage_templates/comments.html', context=comment_dict)

    return render(request, 'commentspage_templates/comments.html', {'commentlist':Comment.objects.order_by('username'), 'form':form})
    # return render(request, 'commentspage_templates/comments.html', {'form':form})