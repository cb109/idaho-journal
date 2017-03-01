"""

send_email_reminders
~~~~~~~~~~~~~~~~~~~~

A command to send email reminders to Users that enabled this feature.

Uses the Google Mail SMTP servers and thus needs a valid gmail account
to be configured in the Django settings. This is a simple solution so
that running our own SMTP server is not required, but remember that
Google limits the mail API usage (we can send ~ 500 mails a day).

We don"t store here how often this command is run, so it is up to you to
run it once per day or whatever. Simplest solution would be to add this
as a daily cron job.

"""
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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

    The email will contain a plain/text and an html version.
    """
    from_email = gmail_user
    to_emails = recipient if type(recipient) is list else [recipient]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = ", ".join(to_emails)

    html = """
    <html>
      <body style="font-family: sans-serif; margin: 20px">
        <h1>{header}</h1>
        {text}
      </body>.
    </html>
    """.format(header=subject, text=body)

    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in
    # this case the HTML message, is best and preferred.
    part1 = MIMEText(body, "plain")
    part2 = MIMEText(html, "html")
    msg.attach(part1)
    msg.attach(part2)

    server = smtplib.SMTP(settings.EMAIL_REMINDER["GMAIL_SMTP_SERVER"],
                          settings.EMAIL_REMINDER["GMAIL_SMTP_PORT"])
    try:
        server.ehlo()
        server.starttls()
        server.login(gmail_user, gmail_pwd)
        server.sendmail(from_email, to_emails, msg.as_string())
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
