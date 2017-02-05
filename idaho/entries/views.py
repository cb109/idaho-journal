from rest_framework import viewsets, permissions

from idaho.entries.models import DiaryEntry
from idaho.entries.serializers import DiaryEntrySerializer


class DiaryEntryViewSet(viewsets.ModelViewSet):
    serializer_class = DiaryEntrySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Only return entries written by the requesting user."""
        filters = {"author": self.request.user, "deleted": False}
        return DiaryEntry.objects.filter(**filters)
