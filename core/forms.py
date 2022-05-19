from django import forms
from myapi.models import Input

class InputForm(forms.ModelForm):

    insulin_in_units  = forms.IntegerField(widget=forms.IntegerField(attrs={'autofocus': False}))
    carbs_in_grams = forms.IntegerField(widget=forms.IntegerField(attrs={'autofocus': False}))
    food_intake = forms.TextInput(widget=forms.IntegerField(attrs={'autofocus': False}))

    class Meta:
        model = Input
        fields = ('insulin_in_units', 'carbs_in_grams', 'food_intake')
        