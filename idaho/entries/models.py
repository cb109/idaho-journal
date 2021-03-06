from __future__ import unicode_literals

import logging

from django.utils import timezone
from django.contrib.auth.models import User
from django.db import models


logger = logging.getLogger(__name__)


class DiaryEntry(models.Model):
    author = models.ForeignKey(User)
    created_at = models.DateTimeField(default=timezone.now)
    modified_at = models.DateTimeField(auto_now=True)
    kind = models.TextField()

    deleted = models.BooleanField(default=False)

    # These will contain encrypted data.
    title = models.TextField()
    body = models.TextField()

    def __str__(self):
        string = "{entry_type} from {author}: {title}".format(
            entry_type=self.__class__.__name__,
            author=self.author,
            title=self.title)
        # Fix problems e.g. when trying to delete this via the admin
        # page while it contains special characters like german umlauts.
        encoded = string.encode("UTF-8")
        return encoded

    def delete(self):
        """Override delete() for a soft-deletion."""
        self.deleted = True
        self.save()
