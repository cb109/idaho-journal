from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic.base import TemplateView

from idaho.entries import urls as entries_urls


urlpatterns = [
    url(r"^admin/", admin.site.urls),
    url(r"^api/", include(entries_urls)),
    url(r"^api-auth/", include("rest_framework.urls",
                               namespace="rest_framework")),
    url(r'^$', TemplateView.as_view(template_name='client.html'),
        name="home"),
]
