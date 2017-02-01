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
    )
    list_display = (
        "title",
        "author",
        "kind",
        "created_at",
        "modified_at",
        "id"
    )

admin.site.site_header = "idaho Administration"
admin.site.register(DiaryEntry, DiaryEntryAdmin)
