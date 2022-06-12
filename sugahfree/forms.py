from django import forms
from django.forms.models import ModelForm
from myapi.models import Input

class InputForm(ModelForm):
    class Meta:
        model = Input
        fields = ['insulin_in_units', 'carbs_in_grams', 'food_intake']
        
class EditInputForm(ModelForm):

# https://docs.djangoproject.com/en/4.0/ref/forms/widgets/
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['insulin_in_units'].widget.attrs.update({'id': 'edit_insulin_in_units'})
        self.fields['carbs_in_grams'].widget.attrs.update({'id':'edit_carbs_in_grams'})
        self.fields['food_intake'].widget.attrs.update({'id':'edit_food_intake'})

    class Meta:
        model = Input
        fields = ('insulin_in_units', 'carbs_in_grams', 'food_intake')

   
            
