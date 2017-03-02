import pytest
import requests
from rest_framework import status

from idaho import __version__
from idaho.core.models import UserProfile


def test_userprofile_is_created_automatically_for_new_user(user):
    assert isinstance(user.userprofile, UserProfile)


def test_userprofile_is_deleted_with_its_user(user):
    userprofile_id = user.userprofile.id
    user.delete()
    with pytest.raises(UserProfile.DoesNotExist):
        UserProfile.objects.get(id=userprofile_id)


class TestCoreAPI:
    """Test the REST API for some core endpoints."""

    def test_api_version(self, live_server, user):
        url = live_server.url + "/version/"
        response = requests.get(url, auth=("user", "password"))
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"version": __version__}
