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


@pytest.fixture
def token(live_server, user):
    """Request a token object via the API and return it."""
    url = live_server.url + "/api/token-auth/"
    basic_auth = {"username": "user", "password": "password"}
    response = requests.post(url, data=basic_auth)
    return response.json()


class TestCoreAPI:
    """Test the REST API for some core endpoints."""

    def test_api_version(self, live_server, user):
        url = live_server.url + "/version/"

        response = requests.get(url, auth=("user", "password"))
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"version": __version__}

    def test_api_token_auth_fail(self, live_server):
        """Try getting a token using invalid authentication."""
        url = live_server.url + "/api/token-auth/"
        basic_auth = {"username": "_", "password": "_"}

        response = requests.post(url, data=basic_auth)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_api_token_auth_success(self, token):
        assert "token" in token

    def test_api_token_verify(self, live_server, token):
        # Verify the token we got against the API. If valid, it will
        # return the very same token.
        url = live_server.url + "/api/token-verify/"

        response = requests.post(url, data=token)
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == token

        # If we change the token in any way, validation will fail.
        token["token"] += "oops!"
        response = requests.post(url, data=token)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
