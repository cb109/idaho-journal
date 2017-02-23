from rest_framework.decorators import api_view
from rest_framework.response import Response

from idaho import __version__


@api_view(["GET"])
def version(request):
    """Return the current backend version as JSON."""
    data = {"version": __version__}
    return Response(data)
