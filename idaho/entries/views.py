from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from idaho.entries.models import DiaryEntry
from idaho.entries.serializers import DiaryEntrySerializer


class DiaryEntryViewSet(viewsets.ModelViewSet):
    serializer_class = DiaryEntrySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return non-deleted entries from requesting user."""
        queryset = DiaryEntry.objects.filter(author=self.request.user,
                                             deleted=False)
        return queryset


@api_view(["GET"])
def count(request):
    """Return number of non-deleted entries from requesting user."""
    amount = DiaryEntry.objects.filter(author=request.user,
                                       deleted=False).count()
    return Response(amount)
