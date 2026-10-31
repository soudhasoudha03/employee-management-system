import re
from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employee
        fields = '__all__'

    def validate_full_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Name must contain at least 2 characters."
            )

        return value

    def validate_phone(self, value):
        digits = re.sub(r'\D', '', value)

        if not 10 <= len(digits) <= 15:
            raise serializers.ValidationError(
                "Phone number must contain 10 to 15 digits."
            )

        if not re.fullmatch(r'[\d+\-\s()]+', value):
            raise serializers.ValidationError(
                "Enter a valid phone number."
            )

        return value

    def validate_salary(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Salary cannot be negative."
            )

        return value