import smtplib

from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand

from idaho.core.models import UserProfile


class Command(BaseCommand):
    help = "Send an email reminder to all users that want to get one."

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        queryset = UserProfile.objects.filter(email_reminder_enabled=True)
        for profile in queryset:
            to_email = profile.user.email
            self.stdout.write("Sending email reminder to: {}"
                              .format(to_email))
            try:
                send_mail(
                    settings.EMAIL_REMINDER["SUBJECT"],
                    settings.EMAIL_REMINDER["BODY"],
                    settings.EMAIL_REMINDER["FROM_EMAIL"],
                    [to_email],
                    fail_silently=False,
                )
            except smtplib.SMTPException as err:
                message = "Could not send email: {}".format(err)
                self.stdout.write(self.style.ERROR(message))
            self.stdout.write(
                self.style.SUCCESS("Successfully send email."))
