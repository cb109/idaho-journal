"""Helpers to be shared across apps."""

from rest_framework.pagination import CursorPagination


class OrderedCursorPagination(CursorPagination):
    """Override field being used to order paginated results."""
    ordering = "-created_at"
