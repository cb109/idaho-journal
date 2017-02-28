from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
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
@permission_classes((permissions.IsAuthenticated, ))
def titles(request):
    """Return title data of non-deleted entries from requesting user.

    Note: Since this is a simple APIView, it is not affected by any
      global pagination settings and returns the full queryset.

    Returns:
        list[dict]: List of dicts containing title and id. Example:
            [
                {
                    'title': '"\"{\\\"iv\\\":\\..."',
                    'id': 123
                },
                ...
            ]
    """
    queryset = DiaryEntry.objects.filter(author=request.user,
                                         deleted=False)
    title_objects = [{"title": entry.title, "id": entry.id}
                     for entry in queryset]
    return Response(title_objects)


@api_view(["GET"])
@permission_classes((permissions.IsAuthenticated, ))
def count(request):
    """Return number of non-deleted entries from requesting user."""
    amount = DiaryEntry.objects.filter(author=request.user,
                                       deleted=False).count()
    return Response(amount)
