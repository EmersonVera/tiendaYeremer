from rest_framework.permissions import BasePermission

from .models import Cliente


class EsDueno(BasePermission):
    """Permite el acceso solo si el objeto pertenece (directa o indirectamente) al usuario autenticado."""

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Cliente):
            return obj.dueno_id == request.user.id
        return obj.cliente.dueno_id == request.user.id
