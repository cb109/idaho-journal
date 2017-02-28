# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.contrib.auth.models import User

from idaho.core.models import UserProfile


def add_missing_userprofiles(apps, schema_editor):
    """Add UserProfile to any User that is still missing one."""
    db_alias = schema_editor.connection.alias
    for user in User.objects.using(db_alias):
        try:
            user.userprofile
        except AttributeError:
            print("Adding UserProfile to user: {}".format(user))
            profile = UserProfile(user=user)
            profile.save()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_missing_userprofiles),
    ]
