# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-02-01 22:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0002_unlimit_entry_title_max_length'),
    ]

    operations = [
        migrations.AddField(
            model_name='diaryentry',
            name='kind',
            field=models.TextField(default='text'),
            preserve_default=False,
        ),
    ]
