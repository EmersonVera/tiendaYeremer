import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Crea (o actualiza la contraseña de) las dos cuentas fijas de tienda a partir de variables de entorno.'

    def handle(self, *args, **options):
        for prefix in ('STORE1', 'STORE2'):
            username = os.environ.get(f'{prefix}_USER')
            password = os.environ.get(f'{prefix}_PASS')
            if not username or not password:
                raise CommandError(f'Faltan las variables de entorno {prefix}_USER / {prefix}_PASS.')

            user, created = User.objects.get_or_create(username=username)
            user.set_password(password)
            user.save()

            accion = 'creado' if created else 'actualizado'
            self.stdout.write(self.style.SUCCESS(f'Usuario "{username}" {accion}.'))
