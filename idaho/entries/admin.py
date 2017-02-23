import json

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
        "deleted",
        "modified_at",
        "content",
    )
    list_editable = (
        "deleted",
    )

    def content(self, obj):
        """Limit maximum length of displayed content."""
        title_obj = json.loads(json.loads(obj.title))
        return title_obj["ct"][:20]

admin.site.site_header = "idaho Administration"
admin.site.register(DiaryEntry, DiaryEntryAdmin)
