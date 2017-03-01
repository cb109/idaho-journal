from django.contrib import admin

from idaho.core.models import UserProfile


class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "__str__",
        "user",
        "user_email",
        "email_reminder_enabled",
    )
    list_editable = (
        "email_reminder_enabled",
    )

    def user_email(self, obj):
        return obj.user.email

admin.site.site_header = "idaho Administration"
admin.site.register(UserProfile, UserProfileAdmin)
