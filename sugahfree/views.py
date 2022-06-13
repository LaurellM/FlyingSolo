
from django.forms import forms
from django.shortcuts import render 
from django.shortcuts import render, redirect, get_object_or_404
from myapi.models import Input
from .forms import InputForm
from django.utils import timezone
from django.contrib.auth.decorators import login_required


def index(request):
    user = request.user
    form = InputForm()
    return render(request, 'sugahfree/home.html', {'form': form, 'user': user})

@login_required
def redirect_to_list():
    return redirect("main_list")

@login_required
def delete(request, pk):
    input = get_object_or_404(Input, pk=pk)
    input.delete()
  
    return redirect("main_list")

@login_required
def main_list(request):
    inputs = Input.objects.filter(user=request.user).order_by('created')
    return render(request, 'sugahfree/main_list.html', {'inputs': inputs})


   