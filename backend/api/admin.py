from django.contrib import admin

from .models import Cliente, Movimiento


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'numero_casa', 'celular', 'dueno', 'creado_en')
    list_filter = ('dueno',)
    search_fields = ('nombre', 'numero_casa', 'celular')


@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'tipo', 'monto', 'fecha')
    list_filter = ('tipo',)
