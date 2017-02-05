import json

from django.contrib import admin

from idaho.entries.models import DiaryEntry


class DiaryEntryAdmin(admin.ModelAdmin):
    readonly_fields = (
        "id",
        "created_at",
        "modified_at"
    )
    fields = (
        "title",
        "kind",
        "body",
        "author",
        "deleted",
    )
    list_display = (
        "content",
        "author",
        "kind",
        "created_at",
        "modified_at",
        "id",
        "deleted",
    )

    def content(self, obj):
        """Limit maximum length of displayed content."""
        title_obj = json.loads(json.loads(obj.title))
        return title_obj["ct"][:50]

admin.site.site_header = "idaho Administration"
admin.site.register(DiaryEntry, DiaryEntryAdmin)
