from decimal import Decimal

from rest_framework import serializers

from .models import Cliente, Movimiento


class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = ['id', 'cliente', 'tipo', 'monto', 'fecha', 'descripcion']
        read_only_fields = ['id', 'fecha']

    def validate_monto(self, value):
        if value <= Decimal('0'):
            raise serializers.ValidationError('El monto debe ser mayor a 0.')
        return value

    def validate(self, attrs):
        tipo = attrs.get('tipo', getattr(self.instance, 'tipo', None))
        descripcion = attrs.get('descripcion', '')
        if tipo == Movimiento.PAGO and descripcion:
            raise serializers.ValidationError(
                {'descripcion': 'La descripción solo es válida para movimientos de tipo FIADO.'}
            )
        return attrs

    def validate_cliente(self, cliente):
        request = self.context['request']
        if cliente.dueno_id != request.user.id:
            raise serializers.ValidationError('Este cliente no pertenece a tu tienda.')
        return cliente


class ClienteSerializer(serializers.ModelSerializer):
    saldo = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'numero_casa', 'celular', 'dueno', 'creado_en', 'saldo']
        read_only_fields = ['id', 'dueno', 'creado_en']
        extra_kwargs = {'dueno': {'read_only': True}}

    def get_saldo(self, obj):
        fiados = sum(
            (m.monto for m in obj.movimientos.all() if m.tipo == Movimiento.FIADO), Decimal('0')
        )
        pagos = sum(
            (m.monto for m in obj.movimientos.all() if m.tipo == Movimiento.PAGO), Decimal('0')
        )
        return fiados - pagos


class ClienteDetalleSerializer(ClienteSerializer):
    movimientos = MovimientoSerializer(many=True, read_only=True)

    class Meta(ClienteSerializer.Meta):
        fields = ClienteSerializer.Meta.fields + ['movimientos']
