from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class Cliente(models.Model):
    nombre = models.CharField(max_length=150)
    numero_casa = models.CharField(max_length=50, blank=True)
    celular = models.CharField(max_length=30, blank=True)
    dueno = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clientes'
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['dueno'])]
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Movimiento(models.Model):
    FIADO = 'FIADO'
    PAGO = 'PAGO'
    TIPO_CHOICES = [(FIADO, 'Fiado'), (PAGO, 'Pago')]

    cliente = models.ForeignKey(
        Cliente, on_delete=models.CASCADE, related_name='movimientos'
    )
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    monto = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))]
    )
    fecha = models.DateTimeField(default=timezone.now)
    descripcion = models.TextField(blank=True)

    class Meta:
        indexes = [models.Index(fields=['cliente'])]
        ordering = ['-fecha']

    def clean(self):
        if self.tipo == self.PAGO and self.descripcion:
            raise ValidationError({'descripcion': 'La descripción solo es válida para movimientos de tipo FIADO.'})

    def __str__(self):
        return f'{self.cliente} - {self.tipo} - {self.monto}'
