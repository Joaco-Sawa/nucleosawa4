# Especificación de Diseño: Sección Billetera de Desafío Sawa

## Resumen Ejecutivo

Se ha implementado una sección **"Billetera"** completa que permite a los usuarios ver, filtrar y analizar su historial de transacciones de puntos. La interfaz sigue los estándares de UX/UI profesionales con una experiencia intuitiva, responsiva y visualmente cohesiva.

---

## 1. ESTRUCTURA GENERAL

### Ubicación en la Plataforma
- **URL**: `/billetera`
- **Acceso**: Desde el header (desktop y mobile) - botón "Billetera"
- **Navegación**: Parte del menú principal de usuarios autenticados

### Flujo de Usuario
```
Usuario entra → Billetera
    ↓
Ve balance destacado + info de vencimiento
    ↓
Explora tabla de movimientos
    ↓
Aplica filtros (tipo, fecha, búsqueda)
    ↓
Accede al catálogo de canjes
```

---

## 2. COMPONENTE PRINCIPAL: WALLET BALANCE

### 2.1 Ubicación y Layout

**Desktop**: Grilla 2 columnas (2/3 + 1/3)
```
┌────────────────────────────────────────┬──────────────────┐
│  BALANCE PRINCIPAL (Saldo + Botón)     │  INFO SECUNDARIA │
│  - Saldo en números grandes (60px)     │  - Desglose      │
│  - Descripción                         │  - Timestamp     │
│  - Botón "Ir al Catálogo" (CTA)       │                  │
└────────────────────────────────────────┴──────────────────┘
```

**Mobile**: Grilla 1 columna
```
┌──────────────────────────────────────┐
│  BALANCE PRINCIPAL                   │
│  (Ancho completo, responsive)        │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│  INFO SECUNDARIA                     │
│  (Debajo del balance)                │
└──────────────────────────────────────┘
```

### 2.2 Componentes del Balance

#### A. Saldo Principal
```
┌─────────────────────────────────────────────────┐
│ Balance de Puntos                               │
│                                                 │
│ 15,450  puntos                                  │
│                                                 │
│ ✓ Disponibles para Canjear en el Catálogo     │
│                                                 │
│ [BOTÓN NARANJA] Ir al Catálogo                │
└─────────────────────────────────────────────────┘
```

**Tipografía**:
- Etiqueta: 12px, texto-slate-600, medium
- Número: 48px (desktop) / 40px (mobile), bold 900, text-slate-900
- Descripción: 14px, text-slate-900, semibold
- Unidad: 18px, text-slate-500

**Colores**:
- Fondo: Blanco (#FFFFFF)
- Borde: 1px solid #E2E8F0 (slate-100)
- Sombra: shadow-md shadow-slate-100

**Interacción**:
- Botón CTA: Gradiente naranja (#FFAD5B → #FF8000)
- Hover: Sombra aumentada, color más oscuro
- Active: Scale 0.98

#### B. Card de Información
```
┌─────────────────────────┐
│ Información de Cuenta   │
│                         │
│ Disponibles:    14,700  │
│ A Vencer:          750  │
│                         │
│ ─────────────────────   │
│ Actualizado:           │
│ 01/04/2024 14:35 hrs   │
└─────────────────────────┘
```

**Desglose**:
- Puntos Disponibles: Total - Puntos Vencimiento
- A Vencer Próximamente: Suma de puntos en tabla `wallet_expirations`
- Timestamp: Fecha y hora de última actualización

### 2.3 Alerta de Vencimiento (Condicional)

Mostrar solo si `expiringPoints > 0` Y `daysUntilExpiration <= 30`

```
┌─────────────────────────────────────────────────────┐
│ ⚠️  Puntos a Vencer Próximamente                   │
│                                                     │
│ Tienes 750 puntos que vencerán el 30 de abril     │
│ (en 15 días). Te recomendamos canjearlo antes      │
│ de que expire.                                      │
└─────────────────────────────────────────────────────┘
```

**Estilos**:
- Fondo: #FEF3C7 (amber-50)
- Borde: 1px solid #FCD34D (amber-200)
- Ícono: AlertTriangle, color #92400E (amber-800)
- Texto: #78350F (amber-900)

---

## 3. TABLA DE MOVIMIENTOS

### 3.1 Estructura

#### Desktop (Con Cabecera)
```
┌──────┬────────────┬──────────────┬─────────┬──────────┐
│Fecha │Movimiento  │ Motivo/Razón │ Puntos  │ Saldo    │
├──────┼────────────┼──────────────┼─────────┼──────────┤
│01/04 │ + 100      │ Desafío      │ +100    │ 15,450   │
│      │ (canje)    │ Completado   │ pts     │ pts      │
├──────┼────────────┼──────────────┼─────────┼──────────┤
│31/03 │ - 250      │ Canje:       │ -250    │ 15,350   │
│      │ (compra)   │ Producto XYZ │ pts     │ pts      │
└──────┴────────────┴──────────────┴─────────┴──────────┘
```

#### Mobile (Compacto Expandible)
```
┌──────────────────────────────────┐
│ 🟢 + 100 pts     |  01/04/24     │
│ Ganancia                         │
│ [v] → expandir                   │
└──────────────────────────────────┘
```

### 3.2 Fila de Transacción

#### Estado Colapsado
```
[ICONO] | Descripción        | +100 pts | [v]
        | Categoría / Fecha  |          |
```

**Componentes**:
- Ícono + Círculo de color (según tipo)
- Descripción principal
- Razón del movimiento (pequeño, slate-500)
- Cantidad + signo (+/-/→/✕)
- Categoría badge
- Flecha expand/collapse

#### Estado Expandido (Mobile/Desktop)
```
Razón: Completaste el desafío "Desafío de la Semana"
Tipo: Ganancia
────────────────────────────
Puntos: +100
Saldo después: 15,450
────────────────────────────
Fecha: 1 de abril de 2024 a las 14:35 hrs
```

### 3.3 Tipos de Transacciones y Estilos

| Tipo | Ícono | Color | Signo | Label |
|------|-------|-------|-------|-------|
| earning | Plus | Verde (green-600) | + | Ganancia |
| bonus | Gift | Ámbar (amber-600) | + | Bonificación |
| redemption | Minus | Azul (blue-600) | - | Canje |
| transfer | RefreshCw | Púrpura (purple-600) | → | Transferencia |
| deduction | TrendingDown | Rojo (red-600) | - | Deducción |
| expiration | Zap | Naranja (orange-600) | ✕ | Vencimiento |

### 3.4 Categorías

```
{
  "general": "General",
  "challenge": "Desafío",
  "promotion": "Promoción",
  "survey": "Encuesta",
  "purchase": "Compra",
  "refund": "Reembolso",
  "store": "Catálogo"
}
```

### 3.5 Paginación

- Items por página: 10
- Navegación: Anterior | 1 2 3 ... | Siguiente
- Botón activo: Gradiente naranja
- Botones inactivos: Borde slate

---

## 4. SISTEMA DE FILTROS

### 4.1 Ubicación
Arriba de la tabla de transacciones, debajo del balance

### 4.2 Componentes

#### A. Buscador de Texto
```
🔍 Buscar movimientos...
```
- Placeholder: "Buscar movimientos..."
- Busca en: `description`, `reason`, `category`
- Input redondeado (rounded-full)
- Ancho: Completo en mobile, variable en desktop

#### B. Filtro de Tipo (Pills)
```
[Todo] [Cargas] [Canjes]
```

- Opciones principales:
  - **Todo**: Todos los tipos
  - **Cargas**: earning + bonus + transfer
  - **Canjes**: redemption + expiration + deduction

- Estados:
  - Inactivo: Borde slate, texto slate-700
  - Activo: Gradiente naranja, texto blanco

#### C. Rango de Fechas
```
📅 01/04/2024 - 30/04/2024
```

- Componente: `DateRangePicker`
- Opciones rápidas:
  - Últimos 7 días
  - Este mes
  - 3 últimos meses
  - Todo el año

#### D. Botón Filtrar
```
[⚙️ Filtrar ∨]
```

- Desktop: Despliega en popover
- Mobile: Abre drawer desde abajo

### 4.3 Estado sin Filtros
```
┌────────────────────────────────────┐
│                                    │
│  No hay movimientos                │
│                                    │
│  No hay transacciones que          │
│  coincidan con los filtros         │
│  seleccionados                     │
│                                    │
└────────────────────────────────────┘
```

---

## 5. HEADER STICKY

### 5.1 Desktop
```
┌──────────────────────────────────────────────────────┐
│ Mi Billetera              [Badge: 15,450 puntos]    │
└──────────────────────────────────────────────────────┘
```

- Posición: `sticky top-0 z-40`
- Fondo: `bg-white/80 backdrop-blur-xl`
- Borde inferior: `border-b border-slate-100`

### 5.2 Mobile
```
┌─────────────────────────────────┐
│ Billetera   [Badge]    [Perfil] │
└─────────────────────────────────┘
```

- Logo a la izquierda
- Badge en el centro
- Foto de perfil a la derecha

---

## 6. RESPONSIVIDAD

### Breakpoints
- **Mobile**: < 768px (md breakpoint)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Cambios Responsivos

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Layout Balance | 1 col | 2 cols (2/3 + 1/3) |
| Tabla Cabecera | Hidden | Visible |
| Filtros | Pills apiladas | Pills inline |
| Fuente Saldo | 40px | 48px |
| Espaciado | px-4 | px-6 |

---

## 7. ANIMACIONES

### Transiciones
- Fade + Slide: Filas expandibles (300ms)
- Hover: Botones (200ms ease-in-out)
- Sombras: Depth effect on hover (300ms)

### Animación de Skeleton (Loading)
```
[░░░░░░░░░░░░░░░░░]  ← Pulsando
```
- 5 skeleton rows
- Pulsación: opacity 0.5 → 1 → 0.5 (2s infinite)

---

## 8. ESTRUCTURA DE DATOS

### Tabla: wallet_movements
```sql
CREATE TABLE wallet_movements (
  id UUID PRIMARY KEY,
  user_id UUID (FK),
  type TEXT ('earning'|'bonus'|'redemption'|'transfer'|'deduction'|'expiration'),
  amount INTEGER,
  balance_after INTEGER,
  description TEXT,
  reason TEXT,
  category TEXT ('general'|'challenge'|'promotion'|'survey'|'purchase'|'refund'|'store'),
  related_challenge_id UUID,
  related_product_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Tabla: wallet_expirations
```sql
CREATE TABLE wallet_expirations (
  id UUID PRIMARY KEY,
  user_id UUID (FK),
  amount INTEGER,
  expires_at TIMESTAMPTZ,
  is_expired BOOLEAN DEFAULT false,
  movement_id UUID (FK),
  created_at TIMESTAMPTZ
);
```

---

## 9. FUNCIONES RPC (Supabase)

### get_user_total_points(p_user_id UUID)
Retorna el total de puntos del usuario

### get_user_expiring_points(p_user_id UUID)
Retorna puntos a vencer en próximos 30 días

### get_user_wallet_movements(p_user_id UUID, p_limit INT, p_offset INT)
Retorna historial paginado de movimientos

---

## 10. INTEGRACIONES

### Con Otras Secciones

#### Botón "Ir al Catálogo"
- Redirige a: `/catalogo`
- Parámetro: `?sort=puntos` (opcional)

#### Link desde Header
- Desktop: Link en menú principal
- Mobile: Dentro de menú horizontal scrollable

#### Link desde Perfil
- Botón "Mi Billetera" en section de puntos

---

## 11. PATRONES DE UX

### Pattern: Expandible Row
```javascript
// Mobile-first: Todos expandibles
// Desktop: Información compacta
// Al click: Expande con animación
// Estado: Se mantiene en session memory
```

### Pattern: Lazy Loading
```javascript
// Load 10 items por página
// Scroll a siguiente: Load 10 más
// Paginación: Botones numerados (máx 5 páginas visible)
```

### Pattern: Filter Persistence
```javascript
// Filtros se guardan en URL params
// ?type=earning&from=2024-04-01&to=2024-04-30
// Permite compartir filtros / bookmark
```

---

## 12. ACCESSIBILITY (A11Y)

### WCAG 2.1 AA Compliance
- Contraste: Todos los textos > 4.5:1
- Botones: Tamaño mínimo 44x44px (touch targets)
- Tablas: Cabecera con `scope="col"`
- Expandibles: `aria-expanded` attribute
- Labels: Input labels asociados con `<label for="">`

### Teclado
- Tab navigation: Todo accesible por teclado
- Enter/Space: Activar botones
- Escape: Cerrar modales/dropdowns

### Screen Reader
- Etiquetas descriptivas en iconos
- Aria-labels para botones sin texto
- Roles semánticos (button, table, heading, etc)

---

## 13. PERFORMANCE

### Optimizaciones
- Lazy load: Tabla pagina de 10 en 10
- Memoization: Componentes Transaction no re-render innecesario
- Virtualization: Considerada para >1000 items
- Image optimization: Iconos como SVG inline

### Métricas Objetivo
- FCP (First Contentful Paint): < 1.5s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1

---

## 14. CASOS DE BORDE

### Sin Puntos
```
Balance: 0 puntos
Aviso: "Completa desafíos para ganar puntos"
Botón: "Ver Desafíos" (link a /desafios)
```

### Sin Movimientos
```
Tabla vacía con ícono
"No hay movimientos"
"Completa desafíos para ganar puntos"
```

### Puntos a Vencer Hoy
```
Alerta: ROJA en lugar de ÁMBAR
Días: 0 días
Énfasis: "VENCE HOY"
```

### Error de Carga
```
Sección fallida
Retry button
Contactar soporte link
```

---

## 15. COMPONENTES REUTILIZADOS

```
WalletView.tsx (Contenedor principal)
├── WalletBalance.tsx (Balance + Alert)
├── WalletTransactions.tsx (Tabla)
├── DateRangePicker.tsx (Filter)
└── [UI Components]
    ├── Button
    ├── Input
    ├── Badge
    ├── Card
    └── Sonner (notificaciones)
```

---

## 16. COLORES

### Paleta Principal
- Naranja activo: #FF8000
- Naranja claro: #FFAD5B
- Blanco: #FFFFFF
- Gris claro: #F1F5F9 (slate-100)

### Estados por Tipo
- Earning: #10B981 (green)
- Bonus: #F59E0B (amber)
- Redemption: #3B82F6 (blue)
- Transfer: #8B5CF6 (purple)
- Deduction: #EF4444 (red)
- Expiration: #FF8000 (orange)

---

## 17. TYPOGRAFÍA

- Font: 'Nunito', sans-serif
- Weights: 400, 500, 600, 700, 800
- Sizes: 10px, 12px, 14px, 16px, 18px, 20px, 24px, 48px

---

## 18. REFERENCIAS DE DISEÑO

Inspirado en:
- Figma's Team Projects page (tablas de datos)
- Stripe Dashboard (transaction history)
- Wise App (wallet interface)
- Apple Wallet (balance display)

---

## ARCHIVO GENERADO

```
src/components/
├── WalletView.tsx (Principal, 350 líneas)
├── WalletBalance.tsx (Balance widget, 120 líneas)
├── WalletTransactions.tsx (Tabla, 200 líneas)
└── [Reutiliza DateRangePicker.tsx]

supabase/
├── migrations/
│   └── create_wallet_system.sql

routes.tsx (Actualizado con /billetera)
Header.tsx (Actualizado con link)
```

---

## PRÓXIMOS PASOS

1. **Data Population**: Insertar datos de prueba en `wallet_movements`
2. **Email Notifications**: Notificar cuando puntos vencen
3. **Export CSV**: Exportar movimientos a CSV
4. **Charts**: Gráfico de tendencia de puntos
5. **Budget Goal**: Establecer meta de puntos a ganar
6. **Mobile App**: Versión nativa

---

## CONCLUSIÓN

La sección Billetera proporciona:
- ✓ Visibilidad completa de puntos
- ✓ Historial detallado de transacciones
- ✓ Filtros flexibles y búsqueda
- ✓ Alertas de vencimiento
- ✓ Experiencia consistente con plataforma
- ✓ Accesibilidad WCAG AA
- ✓ Rendimiento optimizado
- ✓ Responsividad completa
