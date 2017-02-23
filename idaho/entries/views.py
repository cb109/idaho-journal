from rest_framework import viewsets, permissions

from idaho.entries.models import DiaryEntry
from idaho.entries.serializers import DiaryEntrySerializer


class DiaryEntryViewSet(viewsets.ModelViewSet):
    serializer_class = DiaryEntrySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return entries from requesting user, sorted by date."""
        queryset = DiaryEntry.objects.filter(author=self.request.user,
                                             deleted=False)
        return queryset
