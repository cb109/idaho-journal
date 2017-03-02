"""Shared test fixtures."""

import pytest
from django.contrib.auth.models import User


@pytest.fixture
def user(db):
    """Create a new User in the database and return an instance."""
    user = User(username="test-user")
    user.save()
    return user
