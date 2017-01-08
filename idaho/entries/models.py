from __future__ import unicode_literals

import logging

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_auth_token(sender, instance, created, **kwargs):
    """Automatically create a Token for the newly created User."""
    if created:
        logger.info("Creating token for user: {}".format(instance.username))
        Token.objects.create(user=instance)


class DiaryEntry(models.Model):
    author = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    # These will contain encrypted data.
    title = models.CharField(max_length=255)
    body = models.TextField()

    def __str__(self):
        return "{0} from {1}: {2}".format(self.__class__.__name__,
                                          self.author,
                                          self.title)
