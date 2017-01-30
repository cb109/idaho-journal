from rest_framework import viewsets, permissions

from idaho.entries.models import DiaryEntry
from idaho.entries.serializers import DiaryEntrySerializer


class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all()
    serializer_class = DiaryEntrySerializer
    # FIXME: Reenable this once all our frontend requests use the JWT
    #   in their request headers.
    permission_classes = (permissions.IsAuthenticated,)
