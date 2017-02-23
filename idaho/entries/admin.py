import json
import sys

import humanfriendly
from django.contrib import admin

from idaho.entries.models import DiaryEntry


class DiaryEntryAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
        "created_at",
        "modified_at",
        "title",
        "body",
        "kind",
    )
    fields = (
        "title",
        "kind",
        "body",
        "author",
        "deleted",
    )
    list_display = (
        "id",
        "created_at",
        "kind",
        "author",
        "size",
        "deleted",
        "modified_at",
        "content",
    )
    list_editable = (
        "deleted",
    )

    def size(self, obj):
        """Return human friendly size of title + body."""
        concatenated = obj.title + obj.body
        size = sys.getsizeof(concatenated)
        humanized = humanfriendly.format_size(size)
        return humanized

    def content(self, obj):
        """Limit maximum length of displayed content."""
        title_obj = json.loads(json.loads(obj.title))
        return title_obj["ct"][:20]

admin.site.site_header = "idaho Administration"
admin.site.register(DiaryEntry, DiaryEntryAdmin)
