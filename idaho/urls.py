from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic.base import TemplateView

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token
from rest_framework_swagger.views import get_swagger_view

from idaho.entries import urls as entries_urls


schema_view = get_swagger_view(title="idaho API")

urlpatterns = [
    url(r"^admin/", admin.site.urls),
    url(r"^api/", include(entries_urls)),
    url(r"^api/schema", schema_view),
    url(r"^api/auth/", include("rest_framework.urls",
                               namespace="rest_framework")),
    url(r'^api/token-auth/', obtain_jwt_token),
    url(r'^api/token-verify/', verify_jwt_token),
    url(r'^$', TemplateView.as_view(template_name='client.html'),
        name="home"),
]
