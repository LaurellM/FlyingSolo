
from django.forms import forms
from django.shortcuts import render 
from django.shortcuts import render, redirect, get_object_or_404
from myapi.models import Input
from .forms import InputForm
from django.utils import timezone

def index(request):
    user = request.user
    # input = Input.objects.all()
    if request.method == "POST":
        form = InputForm(request.POST)
        if form.is_valid():
            input = form.save(commit=False)
            input.user = request.user
            input.created = timezone.now()
            
            input.save() 
            
            return redirect('main_list')
    else:
        form = InputForm()
    return render(request, 'sugahfree/home.html', {'form': form, 'user': user})


def edit(request, pk):
    input = get_object_or_404(Input, pk=pk)
    if request.method == "POST":
        form = InputForm(request.POST, instance=input)
        if form.is_valid():
            input = form.save(commit=False)
            input.user = request.user
            input.save()
            return redirect("main_list")
    else:
        form = InputForm(instance = input)
    return render(request, 'sugahfree/edit.html', {'form': form, 'user': request.user})        

def redirect_to_list():
    return redirect("main_list")

def delete(request, pk):
    input = get_object_or_404(Input, pk=pk)
    input.delete()
  
    return redirect("main_list")

def main_list(request):
    inputs = Input.objects.filter(user=request.user).order_by('created')
    return render(request, 'sugahfree/main_list.html', {'inputs': inputs})


    

# def ajax_add_input(request):
#     data = {}
#     if request.method == "POST":
#         print(request.POST)
#         insulin_in_units = request.POST.get('insulin_in_units')
#         carbs_in_grams = request.POST.get('carbs_in_grams')
#         food_intake = request.POST.get('food_intake')

#         form = InputForm(request.POST)

#         if form.is_vaild():
#             new_input = form.save()
#             data['saved'] = True
#         else:
#             data['saved'] = False
#         data['insulin_in_units'] = insulin_in_units
#         data['carbs_in_grams'] = carbs_in_grams
#         data['food_intake'] = food_intake

#     else:
#         data['response': 'nothing to get']
#     return JsonResponse(data)


