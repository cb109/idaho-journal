# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-02-24 00:06
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0004_add_deleted_attr_for_soft_deletion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diaryentry',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2017, 2, 24, 0, 6, 6, 353000, tzinfo=utc)),
        ),
    ]
