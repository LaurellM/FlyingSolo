from rest_framework import serializers 
from .models import Input
# from django.core import serializers

# input_json = serializers.serialize("json", Input.objects.get(pk=1), use_natural_foreign_keys=True)

class InputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Input
        fields = ('id', 'insulin_in_units', 'carbs_in_grams', 'food_intake', 'user', 'created', )

        

# class PersonManger(models.Manager):
#  def get_by_natural_key(self, username):
#   return self.get(username=username)

# class Person(models.Model):
#  username = models.CharField(max_length=100)
#  birthdate = models.DateField()
#  objects = PersonManager()

