from django.conf.urls import url, include
from rest_framework import routers

from idaho.entries import views


router = routers.DefaultRouter()
router.register(r"entries", views.DiaryEntryViewSet)

urlpatterns = [
    url(r"^", include(router.urls)),
]
