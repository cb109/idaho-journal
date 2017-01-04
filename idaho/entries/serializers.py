from rest_framework import serializers

from idaho.entries.models import DiaryEntry


class DiaryEntrySerializer(serializers.ModelSerializer):

    class Meta:
        model = DiaryEntry
        fields = ('id', 'author', 'title', 'body', 'created_at', 'modified_at')