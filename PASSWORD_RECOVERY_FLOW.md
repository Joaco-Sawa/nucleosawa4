# Flujo Completo de Recuperación de Contraseña

## Descripción General
Este documento especifica el flujo de recuperación de contraseña para la plataforma Desafío Sawa, incluyendo todos los escenarios posibles, validaciones de seguridad y mensajes del sistema.

---

## FASE 1: INICIO DEL PROCESO

### Paso 1.1: Usuario solicita recuperación
- **Acción del usuario**: Hace clic en "¿Olvidaste tu contraseña?"
- **Estado del sistema**: Transición a pantalla de recuperación
- **Validación**: Ninguna en este paso

### Paso 1.2: Ingreso de identificador
- **Entrada requerida**: Email o nombre de usuario
- **Validaciones**:
  - Campo no vacío
  - Formato email válido (si es email): `^[^\s@]+@[^\s@]+\.[^\s@]+$`
  - Longitud entre 3-254 caracteres
- **Mensajes de validación en tiempo real**:
  - Email vacío: "Por favor ingresa tu correo electrónico"
  - Email inválido: "El formato del correo no es válido"
  - Campo válido: Mostrar ícono de validación

---

## FASE 2: VERIFICACIÓN Y ENVÍO DE TOKEN

### Paso 2.1: Búsqueda de cuenta
- **Acción del servidor**:
  1. Normalizar entrada (lowercase, trim whitespace)
  2. Buscar en tabla `users` por email O username
  3. Verificar que la cuenta existe y está activa
  4. Registrar intento en tabla `password_reset_attempts`

- **Casos de éxito**:
  - ✓ Cuenta encontrada y activa → Proceder a Paso 2.2

- **Casos de fallo** (No revelar si cuenta existe):
  - ✗ Cuenta no encontrada → Mensaje genérico (seguridad)
  - ✗ Cuenta inactiva → Mensaje genérico (seguridad)
  - Respuesta al usuario: "Si existe una cuenta con ese email, recibirás un enlace de recuperación"
  - **Acción silenciosa**: Log del intento fallido

### Paso 2.2: Generación del token
- **Requisitos del token**:
  - Tipo: Token aleatorio criptográfico de 32 caracteres
  - Generación: `crypto.getRandomValues()` en Deno
  - Almacenamiento: Hash SHA-256 en base de datos
  - Expiración: 24 horas desde creación
  - Uso único: Una sola validación permitida

- **Creación del registro**:
  - Tabla: `password_reset_tokens`
  - Campos: `id`, `user_id`, `token_hash`, `created_at`, `expires_at`, `used_at`, `ip_address`, `user_agent`
  - Índices: `user_id`, `expires_at`, `token_hash`

- **Invalidación de tokens anteriores**:
  - Ejecutar: `UPDATE password_reset_tokens SET used_at = now() WHERE user_id = ? AND used_at IS NULL`
  - Esto garantiza un único token válido por usuario

### Paso 2.3: Construcción del enlace de recuperación
- **Formato del enlace**:
  ```
  https://app.com/reset-password?token={TOKEN}&email={USER_EMAIL}
  ```
- **Validaciones en enlace**:
  - Token: 32 caracteres alfanuméricos
  - Email: Validado como email
  - Expiración: Verificada en acceso

### Paso 2.4: Envío de correo
- **Plantilla de email**:
  ```
  Asunto: Recupera tu contraseña - Desafío Sawa

  Hola {USERNAME},

  Hemos recibido una solicitud para recuperar tu contraseña.
  Haz clic en el enlace a continuación para establecer una nueva contraseña:

  [BOTÓN] Recuperar Contraseña

  Este enlace expira en 24 horas.

  Si no solicitaste este cambio, ignora este correo.

  Equipo Desafío Sawa
  ```

- **Seguridad del email**:
  - No revelar detalles internos (IDs, tokens)
  - No enviar token directamente (solo en enlace)
  - Incluir timestamp del envío
  - Incluir IP desde donde se solicitó (opcional, en email separado)

- **Respuesta al usuario**:
  - Mensaje de éxito: "Se ha enviado un enlace de recuperación a tu correo. Verifica tu bandeja de entrada."
  - Redireccionamiento automático: Volver a login después de 3 segundos
  - Sugerencia: "Si no ves el email, revisa tu carpeta de spam"

---

## FASE 3: VALIDACIÓN DEL TOKEN

### Paso 3.1: Usuario accede al enlace
- **Parámetros recibidos**: token, email
- **Validaciones inmediatas**:
  1. Token presente en URL
  2. Email presente en URL
  3. Ambos parámetros con formato correcto

### Paso 3.2: Verificación del token en servidor
- **Búsqueda del token**:
  1. Calcular SHA-256(token) → token_hash
  2. Buscar en `password_reset_tokens` por token_hash
  3. Verificar: `used_at IS NULL` (no usado aún)
  4. Verificar: `expires_at > NOW()` (no expirado)
  5. Verificar: `user_id` = usuario del email proporcionado

- **Casos de éxito**:
  - ✓ Token válido, no usado, no expirado → Proceder a Paso 3.3

- **Casos de fallo**:
  - ✗ Token no encontrado: "El enlace de recuperación no es válido"
  - ✗ Token ya usado: "Este enlace ya fue utilizado. Solicita uno nuevo"
  - ✗ Token expirado: "El enlace expiró. Solicita uno nuevo"
  - ✗ Email no coincide: "El email no coincide. Solicita uno nuevo"
  - ✗ Múltiples intentos fallidos (3+): Crear throttle de 15 minutos

- **Registro de seguridad**: Log de intento fallido con timestamp, IP, user_agent

### Paso 3.3: Mostrar formulario de nueva contraseña
- **Campos requeridos**:
  - Nueva contraseña
  - Confirmar contraseña
  - (Opcional) Checkbox "Cerrar sesión en otros dispositivos"

---

## FASE 4: CREACIÓN DE NUEVA CONTRASEÑA

### Paso 4.1: Validación de contraseña
- **Requisitos mínimos**:
  - Longitud: Mínimo 8 caracteres
  - Complejidad: Debe contener al menos 3 de:
    - Letras mayúsculas (A-Z)
    - Letras minúsculas (a-z)
    - Números (0-9)
    - Caracteres especiales (!@#$%^&*)
  - No puede ser igual a las últimas 3 contraseñas
  - No puede contener nombre de usuario o email

- **Validaciones en tiempo real**:
  - Requerimiento de longitud: Visual indicator (progress bar)
  - Requerimiento de complejidad: Checklist de criterios
  - Coincidencia de contraseñas: Validación en vivo
  - Fortaleza: "Débil", "Media", "Fuerte"

- **Mensajes de error**:
  - "Mínimo 8 caracteres"
  - "Debe contener letras mayúsculas, minúsculas y números"
  - "Contraseña demasiado similar a anteriores"
  - "Las contraseñas no coinciden"

### Paso 4.2: Envío de nueva contraseña
- **Validaciones previas**:
  1. Token aún válido (re-verificar)
  2. Contraseña cumple requisitos
  3. Ambas contraseñas coinciden

- **Operaciones en base de datos** (dentro de transacción):
  1. Recuperar user_id del token
  2. Validar token nuevamente (prevención de race conditions)
  3. Hash de contraseña: bcrypt con salt 12
  4. Actualizar `users.password_hash`
  5. Registrar cambio: INSERT en `password_change_log`
  6. Marcar token como usado: `UPDATE password_reset_tokens SET used_at = NOW()`
  7. Invalidar todas las sesiones del usuario: DELETE de `user_sessions`

- **Registro de auditoría**:
  - Tabla: `audit_log`
  - Registro: Cambio de contraseña exitoso
  - Datos: user_id, timestamp, ip_address, user_agent

---

## FASE 5: CONFIRMACIÓN Y CIERRE

### Paso 5.1: Confirmación de éxito
- **Respuesta del servidor**: HTTP 200 + JSON
  ```json
  {
    "success": true,
    "message": "Tu contraseña ha sido cambiada exitosamente",
    "redirectUrl": "/login"
  }
  ```

- **Mensaje al usuario**:
  - Título: "¡Contraseña actualizada!"
  - Descripción: "Tu contraseña ha sido cambiada correctamente. Inicia sesión con tu nueva contraseña."
  - Botón: "Volver a inicio de sesión"
  - Tiempo de redirección automática: 5 segundos

### Paso 5.2: Invalidación de sesiones
- **Acción**: Cerrar sesión en todos los dispositivos excepto el actual (opcional)
- **Beneficio**: Previene uso de tokens robados
- **Registro**: Log de sesiones invalidadas

### Paso 5.3: Notificación de seguridad
- **Email de confirmación** (enviado 5 minutos después):
  ```
  Asunto: Tu contraseña ha sido cambiada - Desafío Sawa

  Hola {USERNAME},

  Tu contraseña fue cambiada exitosamente el {FECHA} a las {HORA} (UTC-4).

  Si no realizaste este cambio, acciona inmediatamente:
  1. Haz clic en el enlace: [RECUPERAR ACCESO INMEDIATAMENTE]
  2. Contacta a soporte@desafiosawa.com

  Detalles del cambio:
  - Ubicación: {CITY}, {COUNTRY}
  - Dispositivo: {DEVICE_TYPE}
  - IP: {IP_ADDRESS}

  Equipo Desafío Sawa
  ```

---

## MANEJO DE CASOS ESPECIALES Y ERRORES

### Caso A: Usuario con múltiples intentos fallidos
- **Detección**: 3+ intentos fallidos en 15 minutos
- **Acción**: Throttle temporal de 15 minutos
- **Mensaje**: "Demasiados intentos. Intenta nuevamente en 15 minutos"
- **Registro**: Log de IP sospechosa

### Caso B: Solicitud desde IP diferente
- **Detección**: Token usado desde IP diferente a la de creación
- **Acción**:
  - Permitir (por defecto)
  - Log de actividad sospechosa
  - Email adicional de notificación si IP está fuera de país registrado

### Caso C: Cambio de contraseña sin solicitud
- **Prevención**: Validación de token, throttle, logging
- **Detección**: Si usuario reporta cambio no autorizado
- **Acción**:
  - Revert inmediato si es dentro de 1 hora
  - Auditoría completa del evento
  - Contacto con usuario por teléfono registrado

### Caso D: Error de envío de email
- **Reintento**: 3 intentos con backoff exponencial (1s, 5s, 30s)
- **Fallback**: Mensaje al usuario: "Error al enviar email. Intenta nuevamente en 5 minutos"
- **Mantener token**: No expirar token mientras se intenta reenviar
- **Log**: Error detallado para debugging

### Caso E: Cambio de contraseña durante sesión activa
- **Opción 1**: Cerrar sesión y pedir re-autenticación
- **Opción 2**: Mantener sesión si el cambio viene del mismo navegador
- **Recomendación**: Opción 1 (más segura)

---

## CONSIDERACIONES DE SEGURIDAD

### 1. Prevención de ataques de fuerza bruta
- **Límite de intentos**: 5 intentos fallidos por IP en 1 hora
- **Bloqueo temporal**: 30 minutos después de límite alcanzado
- **CAPTCHA**: Después de 10 intentos fallidos en 24 horas

### 2. Prevención de timing attacks
- **Respuesta uniforme**: Mismo tiempo de respuesta para cuenta existente o no
- **Implementación**: Simulación de búsqueda incluso si no existe
- **Hash timing**: Usar operación de hash que consume tiempo similar

### 3. Protección del token
- **Transmisión**: HTTPS obligatorio
- **Almacenamiento**: Token hasheado en BD, original solo en email/URL
- **Expiración**: 24 horas máximo
- **One-time use**: No permitir reutilización

### 4. Validación de email
- **Verificación de propiedad**: Correo debe validarse
- **Notificación inmediata**: Informar al usuario del intento
- **Prevención de enumeration**: No revelar si email existe

### 5. HTTPS y transporte seguro
- **Requerimiento**: Todas las conexiones HTTPS
- **HSTS**: Implementar en headers
- **CSP**: Content Security Policy strict

### 6. Logging y monitoreo
- **Datos a registrar**:
  - Timestamp
  - IP address
  - User agent
  - Resultado (éxito/fallo)
  - Razón del fallo
- **Retención**: 90 días mínimo para análisis
- **Alertas**: Activar si múltiples fallos desde misma IP

### 7. Protección de base de datos
- **Acceso**: Solo conexión desde edge functions
- **Roles**: Crear rol específico con permisos limitados
- **Encriptación**: Contraseñas con bcrypt, tokens hasheados

### 8. RLS (Row Level Security) en Supabase
```sql
-- Solo usuarios pueden ver sus propios tokens
CREATE POLICY "Users see own reset tokens"
  ON password_reset_tokens FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Edge function con service role puede crear tokens
-- (Verificar CORS y origen de solicitud)
```

---

## TIEMPOS DE ESPERA Y SLA

| Proceso | Tiempo | Nota |
|---------|--------|------|
| Envío de email | < 2 segundos | Si falla, reintentar |
| Validación de token | < 500ms | Verificación de BD |
| Creación de nueva contraseña | < 1 segundo | Hash bcrypt |
| Redirección automática | 5 segundos | Permitir lectura de mensaje |
| Expiración de token | 24 horas | Comenzar desde creación |
| Throttle de IP | 15 minutos | Después de 3 intentos fallidos |

---

## FLUJO VISUAL (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│ USUARIO EN LOGIN                                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    Click "¿Olvidaste?"
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ INGRESO DE EMAIL                                            │
│ - Validar formato                                           │
│ - Validación en tiempo real                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    Hacer clic "Enviar"
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ SERVIDOR: BÚSQUEDA DE CUENTA                               │
│ - Buscar email en usuarios                                 │
│ - Registrar intento                                        │
│ - Respuesta genérica (por seguridad)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
            Encontrada    No encontrada
                    │             │
                    ▼             ▼
        ┌──────────────────┐  Mostrar mensaje genérico
        │ GENERAR TOKEN    │  (no revelar si existe)
        │ - 32 caracteres  │
        │ - Hash SHA-256   │
        │ - Exp: 24 horas  │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ ENVIAR EMAIL     │
        │ - Token en enlace│
        │ - Reintentos: 3x │
        └────────┬─────────┘
                 │
                 ▼
        "Email enviado"
        Redireccionar a login

             ─── TIEMPO TRANSCURRIDO ───

        Usuario abre email
                │
                ▼
        Click en enlace
        token=XXX&email=user@mail.com
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ SERVIDOR: VALIDAR TOKEN                                     │
│ - Verificar token hash                                      │
│ - Verificar no expirado                                     │
│ - Verificar no usado                                        │
│ - Verificar email coincide                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                Válido      Inválido/Expirado
                    │             │
                    ▼             ▼
        Mostrar formulario    Error + opción
        - Nueva contraseña    para solicitar
        - Confirmar           nuevo token
        - Validar complejidad
                    │
                    │
        Usuario ingresa
        nueva contraseña
                    │
                    ▼
        Validaciones:
        - 8+ caracteres
        - Complejidad
        - No igual a antiguas
        - Coincidencia
                    │
                    ▼
        Click "Cambiar contraseña"
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ SERVIDOR: ACTUALIZAR CONTRASEÑA                             │
│ - Transacción DB                                            │
│ - Validar token nuevamente                                  │
│ - Hash bcrypt                                               │
│ - Actualizar contraseña                                     │
│ - Marcar token como usado                                   │
│ - Invalidar sesiones                                        │
│ - Log auditoría                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────┐
        │ "¡Éxito!"                │
        │ Redireccionar a login    │
        │ Enviar email confirmación│
        └──────────────────────────┘
```

---

## PRUEBAS RECOMENDADAS

### Pruebas funcionales
- [ ] Recuperación exitosa de contraseña
- [ ] Rechazo de token expirado
- [ ] Rechazo de token ya usado
- [ ] Validación de email inválido
- [ ] Validación de contraseña débil
- [ ] Cambio exitoso de contraseña

### Pruebas de seguridad
- [ ] No revelar si usuario existe
- [ ] Timing attack resistance
- [ ] Throttling de intentos fallidos
- [ ] Protección contra fuerza bruta
- [ ] Validación de origen CORS
- [ ] HTTPS enforcement

### Pruebas de edge cases
- [ ] Acceso desde IP diferente
- [ ] Solicitudes concurrentes del mismo usuario
- [ ] Token en cola de espera durante procesamiento
- [ ] Cambio mientras hay sesión activa
- [ ] Error de email durante cambio

---

## Versión del documento
- Versión: 1.0
- Fecha: 2024
- Estado: Especificación completa
