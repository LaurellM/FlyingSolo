from os import access
from django.db import models
from sugahfree.models import User

class Input(models.Model):
    
    insulin_in_units = models.IntegerField()
    carbs_in_grams = models.IntegerField()
    food_intake = models.TextField(blank=False)
    user = models.ForeignKey(User, related_name= 'inputs', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add= True)
    modified_at = models.DateTimeField(auto_now= True)


