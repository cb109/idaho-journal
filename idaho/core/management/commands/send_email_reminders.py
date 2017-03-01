"""

send_email_reminders
~~~~~~~~~~~~~~~~~~~~

A command to send email reminders to Users that enabled this feature.

Uses the Google Mail SMTP servers and thus needs a valid gmail account
to be configured in the Django settings. This is a simple solution so
that running our own SMTP server is not required, but remember that
Google limits the mail API usage (we can send ~ 500 mails a day).

We don't store here how often this command is run, so it is up to you to
run it once per day or whatever. Simplest solution would be to add this
as a daily cron job.

"""
import smtplib

from django.conf import settings
from django.core.management.base import BaseCommand

from idaho.core.models import UserProfile


def send_email_via_gmail(gmail_user, gmail_pwd, recipient, subject, body):
    """Send email using the Google Mail SMTP server.

    Args:
        gmail_user (str): Email that identifies your Google account.
        gmail_pwd (str): Password that authenticates your Google account.
        recipient (str|list[str]): One or more email addresses to send to.
        subject (str): Subject for the email to use.
        body (str): Message body of the email.
    """
    from_email = gmail_user
    to_emails = recipient if type(recipient) is list else [recipient]

    message = ("From: {0}\nTo: {1}\nSubject: {2}\n\n{3}"
               .format(from_email, ", ".join(to_emails), subject, body))

    server = smtplib.SMTP(settings.EMAIL_REMINDER["GMAIL_SMTP_SERVER"],
                          settings.EMAIL_REMINDER["GMAIL_SMTP_PORT"])
    try:
        server.ehlo()
        server.starttls()
        server.login(gmail_user, gmail_pwd)
        server.sendmail(from_email, to_emails, message)
    finally:
        server.quit()


class Command(BaseCommand):
    help = "Send an email reminder to all users that want to get one."

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        queryset = UserProfile.objects.filter(email_reminder_enabled=True)
        for userprofile in queryset:
            recipient = userprofile.user.email
            self.stdout.write("Sending email reminder to: {}"
                              .format(recipient))
            try:
                send_email_via_gmail(
                    settings.EMAIL_REMINDER["GMAIL_USER"],
                    settings.EMAIL_REMINDER["GMAIL_PWD"],
                    recipient,
                    settings.EMAIL_REMINDER["SUBJECT"],
                    settings.EMAIL_REMINDER["BODY"],
                )
            except smtplib.SMTPException as err:
                message = "Could not send email: {}".format(err)
                self.stdout.write(self.style.ERROR(message))
            self.stdout.write(
                self.style.SUCCESS("Successfully send email."))
