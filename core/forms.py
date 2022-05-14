from django import forms
from myapi.models import Input

class InputForm(forms.ModelForm):

    class Meta:
        model = Input
        fields = ('insulin_in_units', 'carbs_in_grams', 'food_intake')