import pytest

from idaho.core.models import UserProfile


def test_userprofile_is_created_automatically_for_new_user(user):
    assert isinstance(user.userprofile, UserProfile)


def test_userprofile_is_deleted_with_its_user(user):
    userprofile_id = user.userprofile.id
    user.delete()
    with pytest.raises(UserProfile.DoesNotExist):
        UserProfile.objects.get(id=userprofile_id)
