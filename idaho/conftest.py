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


@pytest.fixture
def another_user(db):
    """Create a new User in the database and return an instance."""
    user = User.objects.create_user(username="another_user",
                                    password="another_password")
    return user


@freeze_time("2011-11-1")
@pytest.fixture
def entry(user):
    """Create a DiaryEntry of kind text with frozen timestamps."""
    entry = DiaryEntry(kind="text", author=user, title="My Title",
                       body="My Body")
    entry.save()
    return entry


@pytest.fixture
def entries(user, another_user):
    """Create a few different DiaryEntry with frozen timestamps."""
    entries = [
        DiaryEntry(kind="text", author=user, title="My Text Entry",
                   body="My Text Body"),
        DiaryEntry(kind="image", author=user, title="My Image Entry",
                   body="My Image Body"),
        DiaryEntry(kind="audio", author=user, title="My Audio Entry",
                   body="My Audio Body"),
        DiaryEntry(kind="text", author=another_user,
                   title="My other Text Entry", body="My other Text Body"),
        DiaryEntry(kind="image", author=another_user,
                   title="My other Image Entry", body="My other Image Body"),
        DiaryEntry(kind="audio", author=another_user,
                   title="My other Audio Entry", body="My other Audio Body"),
    ]
    for entry in entries:
        entry.save()
    return entries
