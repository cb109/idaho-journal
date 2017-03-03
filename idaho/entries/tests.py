import pytest
import requests
from rest_framework import status

from idaho.entries.models import DiaryEntry


def test_diaryentry_has_automatic_datetimefields(entry):
    """Note: We use freezegun in the fixture to have static datetimes."""
    expected_datetime_str = "2011-11-01 00:00:00+00:00"
    assert str(entry.created_at) == expected_datetime_str
    assert str(entry.modified_at) == expected_datetime_str


def test_soft_deletion(entry):
    """Check that the DiaryEntry is not actually removed."""
    entry_id = entry.id
    assert not entry.deleted

    entry.delete()

    entry = DiaryEntry.objects.get(id=entry_id)
    assert entry
    assert entry.deleted


@pytest.fixture(scope="class")
def entries_url(live_server):
    return live_server.url + "/api/entries/"


@pytest.fixture
def user_auth(user):
    return ("user", "password")


def test_entries_count(live_server, entries):
    url = live_server.url + "/api/entries/count/"
    basic_auth = ("user", "password")

    response = requests.get(url, auth=basic_auth)
    assert response.status_code == status.HTTP_200_OK
    # Only half of the entries are from this user.
    assert response.json() == 3


class TestAPICreate:

    def test_api_create_unauthorized(self, entries_url):
        response = requests.get(entries_url, auth=("nope", "nope"))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_api_create_malformed(self, entries_url, user_auth):
        entry = {"title": "title", "kind": "text"}  # "body" missing.

        response = requests.post(entries_url, data=entry, auth=user_auth)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_api_create_success(self, entries_url, user_auth):
        entry = {"title": "title", "kind": "text", "body": "body"}

        response = requests.post(entries_url, data=entry, auth=user_auth)
        assert response.status_code == status.HTTP_201_CREATED


class TestAPIList:

    def test_api_list_unauthorized(self, entries_url):
        response = requests.get(entries_url, auth=("nope", "nope"))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_api_list_only_for_current_user(
            self, entries_url, entries, user, user_auth):
        response = requests.get(entries_url, auth=user_auth)
        assert response.status_code == status.HTTP_200_OK

        # Note: We get a paginated response, hence get the 'results'.
        data = response.json()["results"]
        assert len(data) == 3
        assert [entry["author"] == user.id for entry in data]


@pytest.fixture
def audio_entry_id(entries):
    """Return the id (as string) of a specific audio entry."""
    for entry in entries:
        if entry.body == "My other Audio Body":
            return str(entry.id)


class TestAPIRetrieve:

    def test_api_retrieve_nonexisting(self, entries_url, user_auth):
        url = entries_url + "99999999"
        response = requests.get(url, auth=user_auth)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_api_retrieve_unauthorized(self, entries_url, audio_entry_id):
        url = entries_url + audio_entry_id
        response = requests.get(url, auth=("nope", "nope"))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_api_retrieve_from_another_user_fails(self, entries_url,
                                                  user_auth, audio_entry_id):
        """Even if authenticated, we can't retrieve other people's entries."""
        url = entries_url + audio_entry_id  # Entry belongs to another_user.
        response = requests.get(url, auth=user_auth)
        assert response.status_code == status.HTTP_404_NOT_FOUND
