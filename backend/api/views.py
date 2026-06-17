from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Cliente, Movimiento
from .permissions import EsDueno
from .serializers import ClienteDetalleSerializer, ClienteSerializer, MovimientoSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, EsDueno]

    def get_queryset(self):
        queryset = Cliente.objects.filter(dueno=self.request.user)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search)
                | Q(celular__icontains=search)
                | Q(numero_casa__icontains=search)
            )
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClienteDetalleSerializer
        return ClienteSerializer

    def perform_create(self, serializer):
        serializer.save(dueno=self.request.user)

    def _crear_movimiento(self, request, pk, tipo):
        cliente = self.get_object()
        data = {**request.data, 'cliente': cliente.id, 'tipo': tipo}
        serializer = MovimientoSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            ClienteDetalleSerializer(cliente, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'])
    def fiado(self, request, pk=None):
        return self._crear_movimiento(request, pk, Movimiento.FIADO)

    @action(detail=True, methods=['post'])
    def pago(self, request, pk=None):
        return self._crear_movimiento(request, pk, Movimiento.PAGO)
