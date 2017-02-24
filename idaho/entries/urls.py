from django.conf.urls import url, include
from rest_framework import routers

from idaho.entries import views


router = routers.DefaultRouter()
router.register(r"entries", views.DiaryEntryViewSet, base_name="entries")

urlpatterns = [
    url(r"^entries/count/", views.count),
    url(r"^", include(router.urls)),
]
