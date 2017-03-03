import pytest
from django.core.management import call_command


@pytest.fixture
def user_with_reminder(user):
    user.userprofile.email_reminder_enabled = True
    user.save()
    return user


def test_command_mocked_send_email_reminders(monkeypatch, user_with_reminder):
    """Check that the command will call the gmail func with correct args."""

    def assert_send_email_via_gmail(*args):
        assert args == (
            'user@gmail.com', 'secret-password', u'user@domain.com',
            'idaho - How did your day go?',
            ("Record some thoughts and memories with "
             "<a href='https://localhost:4200/' target='blank_'>idaho</a>"))

    monkeypatch.setattr(("idaho.core.management.commands."
                         "send_email_reminders.send_email_via_gmail"),
                        assert_send_email_via_gmail)
    call_command("send_email_reminders")
