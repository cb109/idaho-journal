from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class DiaryEntry(models.Model):
    author = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    # These will contain encrypted data.
    title = models.CharField(max_length=255)
    body = models.TextField()

    def __str__(self):
        return '{0} from {1}: {2}'.format(self.__class__.__name__,
                                          self.author,
                                          self.title)
