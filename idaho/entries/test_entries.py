from pprint import pprint

import pytest
from django.contrib.auth.models import User

from idaho.entries.models import TextEntry
from idaho.entries.serializers import TextEntrySerializer


@pytest.fixture
def user(db):
    user = User(username="johndoe")
    user.save()
    return user


def test_all(user):
    entry = TextEntry(author=user,
                      title="First Entry",
                      body="This is my first diary entry.")
    entry.save()

    serialized = TextEntrySerializer(entry)
    pprint(dict(serialized.data))
