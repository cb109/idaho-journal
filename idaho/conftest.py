"""Shared test fixtures."""

import pytest
from freezegun import freeze_time
from django.contrib.auth.models import User

from idaho.entries.models import DiaryEntry


@pytest.fixture
def user(db):
    """Create a new User in the database and return an instance."""
    user = User.objects.create_user(username="user",
                                    password="password")
    return user


@freeze_time("2011-11-1")
@pytest.fixture
def entry(user):
    """Create a DiaryEntry of kind text with frozen timestamps."""
    entry = DiaryEntry(kind="text", author=user, title="My Title",
                       body="My Body")
    entry.save()
    return entry
