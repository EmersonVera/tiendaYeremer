# Instrucciones de Implementación — App de Control de Fiados

Documento de trabajo para Claude Code. Implementa el proyecto **en el orden de la sección 8**. No te saltes pasos. Valida cada fase antes de pasar a la siguiente.

---

## 0. Resumen del proyecto

App web para llevar el control de **fiados** (crédito informal) de tiendas de barrio.

- **Frontend:** React (Vite)
- **Backend:** Django + Django REST Framework
- **DB:** Supabase (PostgreSQL) — misma instancia para dev y prod, separadas por esquema/credenciales según prefieras
- **Auth:** dos cuentas fijas (una por tienda), **sin registro público**
- **Aislamiento:** cada cuenta solo ve y administra **sus propios** clientes y movimientos
- **Despliegue:** Render (backend como Web Service, frontend como Static Site)
- **UI:** mobile-first, responsive hasta escritorio

### Reglas de negocio clave
- **Cliente:** `nombre` (obligatorio), `numero_casa` (opcional), `celular` (opcional). Siempre asociado a la tienda que lo creó.
- **Movimiento:** `tipo` (`FIADO` | `PAGO`), `monto` (> 0), `fecha`, `descripcion` (opcional, **solo válida para FIADO**). Asociado a un cliente.
- **Saldo del cliente** = Σ(fiados) − Σ(pagos). **Nunca** se guarda como columna persistente: se calcula on-the-fly.

---

## 1. Estructura de carpetas

```
fiados/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example          # plantilla, SIN valores reales
│   ├── .gitignore
│   ├── render.yaml           # opcional: blueprint de Render
│   ├── build.sh              # script de build para Render
│   ├── config/               # proyecto Django
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── api/                  # app principal
│       ├── __init__.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── permissions.py
│       ├── urls.py
│       ├── admin.py
│       └── migrations/
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    ├── .gitignore
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── client.js          # axios/fetch wrapper + interceptor de token
        ├── auth/
        │   ├── AuthContext.jsx     # estado de sesión
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── ClientesList.jsx
        │   ├── ClienteDetalle.jsx
        │   ├── NuevoCliente.jsx
        │   ├── NuevoFiado.jsx
        │   └── RegistrarPago.jsx
        ├── components/             # botones, inputs, card de cliente, etc.
        ├── hooks/
        └── styles/
```

---

## 2. Backend — Django + DRF

### 2.1 Entorno y dependencias
- Crea entorno virtual y `requirements.txt` con: `Django`, `djangorestframework`, `djangorestframework-simplejwt`, `psycopg2-binary`, `django-cors-headers`, `python-dotenv` (o `django-environ`), `gunicorn`, `dj-database-url`, `whitenoise`.
- Crea proyecto `config` y app `api`.

### 2.2 Variables de entorno (`.env`)
Lee toda la config sensible desde el entorno. Crea `.env.example` con estas claves (sin valores):
```
DJANGO_SECRET_KEY=
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
CORS_ALLOWED_ORIGINS=http://localhost:5173
```
- `DATABASE_URL` es la **connection string de Supabase** (Project Settings → Database → Connection string, modo *session* o *transaction pooler*). Parsea con `dj-database-url`.
- **Nunca** pongas el `.env` real en git (ver sección 7).

### 2.3 Modelos (`api/models.py`)
- **Usa el `User` de Django** para las dos cuentas de tienda. No hace falta modelo de tienda separado; la "tienda" **es** el usuario. (Si más adelante una tienda necesita varios usuarios, se migra a un modelo `Tienda` con FK — déjalo anotado pero no lo implementes ahora.)
- `Cliente`:
  - `nombre` (CharField, requerido)
  - `numero_casa` (CharField, blank=True)
  - `celular` (CharField, blank=True)
  - `dueno` = FK a `User`, `on_delete=CASCADE`, `related_name="clientes"`
  - `creado_en` (auto_now_add)
- `Movimiento`:
  - `cliente` = FK a `Cliente`, `on_delete=CASCADE`, `related_name="movimientos"`
  - `tipo` = CharField con choices `FIADO` / `PAGO`
  - `monto` = DecimalField(max_digits=12, decimal_places=2), validación > 0
  - `fecha` = DateTimeField(default=now) o DateField según necesidad
  - `descripcion` = TextField(blank=True)
  - Validación a nivel de modelo (`clean()`): si `tipo == PAGO`, `descripcion` debe quedar vacía.
- Genera migraciones y aplícalas contra Supabase.

### 2.4 Autenticación (JWT)
- Usa `djangorestframework-simplejwt`.
- Endpoint de login devuelve `access` + `refresh` token.
- Las dos cuentas fijas se crean por seed (management command o `python manage.py shell` documentado), **no** por endpoint público. Crea un management command `seed_stores` que cree los dos usuarios leyendo sus credenciales desde variables de entorno (`STORE1_USER`, `STORE1_PASS`, `STORE2_USER`, `STORE2_PASS`) — así no quedan hardcodeadas.

### 2.5 Permisos / aislamiento por tienda (`api/permissions.py`)
- **Crítico:** cada cuenta solo ve lo suyo. Implementa esto en **dos capas**:
  1. **Queryset:** en cada vista, filtra `Cliente.objects.filter(dueno=request.user)` y `Movimiento.objects.filter(cliente__dueno=request.user)`.
  2. **Object permission:** clase `EsDueno` que verifique `obj.dueno == request.user` (o `obj.cliente.dueno == request.user` para movimientos) en detalle/escritura.
- Al crear un cliente, asigna `dueno=request.user` en `perform_create` — nunca confíes en un `dueno` que venga del body.
- Todas las vistas requieren `IsAuthenticated`.

### 2.6 Serializers (`api/serializers.py`)
- `ClienteSerializer`: campos del cliente + campo calculado `saldo` (SerializerMethodField que suma fiados − pagos). `dueno` es read-only.
- `ClienteDetalleSerializer`: lo anterior + `movimientos` anidados (orden descendente por fecha).
- `MovimientoSerializer`: valida `monto > 0` y la regla de `descripcion` solo-en-FIADO. `cliente` se valida que pertenezca al `request.user`.

### 2.7 Endpoints (`api/views.py` + `api/urls.py`)
Expón estos endpoints bajo `/api/`:

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login/` | Login, devuelve tokens |
| POST | `/api/auth/refresh/` | Refresca access token |
| GET | `/api/clientes/` | Lista clientes del usuario. Soporta `?search=` (nombre/celular/casa) |
| POST | `/api/clientes/` | Crea cliente (dueño = user actual) |
| GET | `/api/clientes/{id}/` | Detalle de cliente + historial de movimientos + saldo |
| POST | `/api/clientes/{id}/fiado/` | Registra un FIADO para ese cliente |
| POST | `/api/clientes/{id}/pago/` | Registra un PAGO/abono para ese cliente |

- Usa un `ModelViewSet` para clientes + acciones `@action` para `fiado` y `pago`, o vistas explícitas. Lo que sea más simple.
- El `search` con `?search=` puede ir con `SearchFilter` de DRF o filtrado manual `Q(nombre__icontains=...) | Q(...)`.

### 2.8 CORS y settings
- `corsheaders` en `MIDDLEWARE` (arriba del todo) y `CORS_ALLOWED_ORIGINS` desde env.
- `REST_FRAMEWORK` con `DEFAULT_AUTHENTICATION_CLASSES = JWTAuthentication` y `DEFAULT_PERMISSION_CLASSES = IsAuthenticated`.

---

## 3. Frontend — React (Vite)

### 3.1 Setup
- Scaffold con Vite (`react`).
- Instala: `react-router-dom`, `axios`. Para estilos, reutiliza el CSS que venga en los HTML de Stitch (ver sección 4); no metas una librería de UI pesada salvo que los diseños lo exijan.
- `.env.example` con `VITE_API_URL=http://localhost:8000/api`. **Nunca** hardcodees la URL del backend.

### 3.2 Cliente HTTP (`src/api/client.js`)
- Wrapper de axios con `baseURL = import.meta.env.VITE_API_URL`.
- Interceptor de request: adjunta `Authorization: Bearer <access>` si hay token.
- Interceptor de response: ante 401, intenta refresh; si falla, limpia sesión y manda a `/login`.
- Guarda tokens en memoria + `localStorage` (suficiente para este caso; deja anotado que es un trade-off).

### 3.3 Auth / sesión (`src/auth/`)
- `AuthContext`: expone `user`, `login(credenciales)`, `logout()`, estado de carga.
- `ProtectedRoute`: si no hay sesión, redirige a `/login`.

### 3.4 Rutas (`react-router-dom`)
```
/login                 -> Login
/                      -> ClientesList        (protegida)
/clientes/nuevo        -> NuevoCliente        (protegida)
/clientes/:id          -> ClienteDetalle      (protegida)
/clientes/:id/fiado    -> NuevoFiado          (protegida)
/clientes/:id/pago     -> RegistrarPago       (protegida)
```

### 3.5 Pantallas (mapeo con la API)
- **Login** → `POST /auth/login/`, guarda tokens, redirige a `/`.
- **ClientesList** → `GET /clientes/` con buscador (`?search=`). Cada item muestra nombre + saldo. Botón "nuevo cliente".
- **ClienteDetalle** → `GET /clientes/:id/`. Muestra datos, saldo y lista de movimientos. Botones para registrar fiado y pago.
- **NuevoCliente** → `POST /clientes/`.
- **NuevoFiado** → `POST /clientes/:id/fiado/` (monto + descripción).
- **RegistrarPago** → `POST /clientes/:id/pago/` (monto, sin descripción).
- Formatea el saldo como moneda local (COP) en la UI.

---

## 4. Diseños de Stitch (referencia visual obligatoria)

**Antes de construir cualquier pantalla**, revisa la carpeta de HTML de Stitch.

> ⚠️ Ubicación esperada: `frontend/design/` (o la ruta donde el usuario haya dejado los `.html`). Si la carpeta no existe o está vacía, **pregunta al usuario por los archivos antes de inventar el diseño**.

Para cada HTML:
1. Léelo entero (estructura, clases, CSS inline o en `<style>`).
2. Conviértelo en un componente React equivalente en `src/pages/` o `src/components/`, **conservando el layout y los estilos** (extrae el CSS a archivos en `src/styles/` o módulos CSS).
3. Mantén el enfoque **mobile-first** y verifica que sea responsive en escritorio (usa los media queries que ya traigan los HTML; añade los que falten).
4. Reemplaza el contenido estático por datos reales de la API y conecta los formularios a los endpoints de la sección 3.5.

Pantallas esperadas según lo descrito: login, lista de clientes, detalle de cliente, nuevo cliente, nuevo fiado, registrar pago. Empareja cada HTML con su ruta.

---

## 5. Despliegue en Render

### 5.1 Backend (Web Service)
- `build.sh`:
  ```bash
  pip install -r requirements.txt
  python manage.py collectstatic --no-input
  python manage.py migrate
  ```
- Start command: `gunicorn config.wsgi:application`
- `settings.py` para producción:
  - `DEBUG` desde env (False en prod).
  - `ALLOWED_HOSTS` incluye el dominio `.onrender.com` del servicio (desde env).
  - `whitenoise` para estáticos del admin.
  - `CORS_ALLOWED_ORIGINS` con la URL del frontend en Render.
  - `SECURE_PROXY_SSL_HEADER`, `CSRF_TRUSTED_ORIGINS` con el dominio de Render.
- Variables de entorno en el dashboard de Render: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL` (Supabase), `CORS_ALLOWED_ORIGINS`, `STORE1_*`, `STORE2_*`.
- Tras el primer deploy, corre `seed_stores` una vez (Render Shell o un job).

### 5.2 Frontend (Static Site)
- Build command: `npm install && npm run build`. Publish dir: `dist`.
- Variable de entorno `VITE_API_URL` = URL del backend en Render (`https://<backend>.onrender.com/api`).
- Configura *rewrite* `/* -> /index.html` (200) para que funcione el routing de SPA.

### 5.3 Supabase
- Usa la connection string del **pooler** para Render (mejor para conexiones serverless).
- Confirma que la IP/políticas de Supabase permiten conexiones de Render (por defecto sí, es pública con credenciales).

---

## 6. Orden lógico de implementación

Sigue este orden y **valida al final de cada bloque** (la sección 7 dice cómo):

1. **Scaffold** backend (proyecto + app) y conexión a Supabase vía `DATABASE_URL`. Verifica `migrate` corre sin error.
2. **Modelos** `Cliente` y `Movimiento` + migraciones aplicadas.
3. **Auth JWT** + management command `seed_stores`. Verifica login con `curl`/Postman devuelve tokens.
4. **Serializers + permisos + endpoints**. Verifica con dos usuarios distintos que **no** se ven datos cruzados.
5. **Scaffold frontend** (Vite) + cliente HTTP + AuthContext + rutas protegidas. Verifica login real contra el backend.
6. **Revisar HTML de Stitch** y convertir pantallas a React una por una, conectándolas a la API (empieza por Login → ClientesList → ClienteDetalle → formularios).
7. **Responsive check** en mobile y escritorio.
8. **Settings de producción** + `build.sh` + archivos de Render.
9. **Deploy backend**, correr `seed_stores`, **deploy frontend**, ajustar CORS y `VITE_API_URL`. Prueba end-to-end en Render.

---

## 7. Validación y buenas prácticas

### Validar antes de declarar hecho
- Backend: cada endpoint probado (login, CRUD, aislamiento entre las dos tiendas, cálculo de saldo correcto, rechazo de `descripcion` en pagos y de `monto <= 0`).
- Frontend: cada pantalla carga datos reales y los formularios persisten.
- No marques una fase como completa sin evidencia (request exitoso, test, o screenshot del flujo).

### No exponer credenciales
- `.gitignore` en **ambos** proyectos debe incluir: `.env`, `.env.local`, `*.env`, `db.sqlite3`, `__pycache__/`, `node_modules/`, `dist/`, `/staticfiles/`.
- Sube solo `.env.example` con claves vacías. **Nunca** commits con `DATABASE_URL`, `SECRET_KEY` ni credenciales de Supabase/tiendas.
- `SECRET_KEY` y credenciales de las tiendas se generan/definen como variables de entorno en Render, no en código.
- Si en algún momento una credencial llega a quedar en el historial de git, avísalo: hay que rotarla, no basta con borrarla del último commit.

### Otras consideraciones
- **Saldo siempre calculado**, nunca columna persistida (evita inconsistencias).
- **Decimal, no float**, para montos.
- Valida montos en backend **y** frontend (el backend es la fuente de verdad).
- Considera índices en `Cliente.dueno` y `Movimiento.cliente` para listados rápidos.
- Maneja estados de carga y error en cada pantalla (la app se usará con conexión móvil inestable).
- Deja anotada la posible migración futura a modelo `Tienda` con múltiples usuarios, por si crece.
