import shutil

import requests
from django.core.management.base import BaseCommand, CommandError

from idaho.entries.models import DiaryEntry


class Command(BaseCommand):
    help = "Generate some random entries in the database."

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        self._create_image_entries(10)
        self.stdout.write(self.style.SUCCESS("Done!"))

    def _create_image_entries(self, num_images):
        generate_image_url = "http://lorempixel.com/640/480/"
        for i in range(num_images - 1):
            self.stdout.write("Downloading image {}/{}..."
                             .format(i + 1, num_images))
            response = requests.get(generate_image_url, stream=True)
            suffix = str(i).zfill(4)
            filename = "test-image-{}.jpg".format(suffix)
            with open(filename, "wb") as f:
                # shutil.copyfileobj(response.raw, f)
                entry = DiaryEntry(author=User.objects.first(),
                                   kind="image",
                                   title)
