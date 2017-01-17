from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic.base import TemplateView

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

from idaho.entries import urls as entries_urls


urlpatterns = [
    url(r"^admin/", admin.site.urls),
    url(r"^api/", include(entries_urls)),
    url(r"^api-auth/", include("rest_framework.urls",
                               namespace="rest_framework")),
    url(r'^api-token-auth/', obtain_jwt_token),
    url(r'^api-token-verify/', verify_jwt_token),
    url(r'^$', TemplateView.as_view(template_name='client.html'),
        name="home"),
]
