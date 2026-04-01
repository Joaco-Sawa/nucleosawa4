# Implementación de Dropdowns de Filtro en Muro

## Descripción General

Se reemplazaron los chips de filtro estilo "pills" por dos menús dropdown organizados y elegantes integrados directamente en el header blanco, proporcionando una mejor experiencia de usuario y una interfaz más limpia.

## Cambios Realizados

### 1. Nuevos Estados Agregados

```typescript
const [dateFilter, setDateFilter] = useState<'7days' | 'thisMonth' | 'lastMonth' | 'custom' | null>(null);
const [showTypeDropdown, setShowTypeDropdown] = useState(false);
const [showDateDropdown, setShowDateDropdown] = useState(false);
const typeDropdownRef = useRef<HTMLDivElement>(null);
const dateDropdownRef = useRef<HTMLDivElement>(null);
```

### 2. Dropdown de Tipo

**Ubicación:** Header blanco, al lado derecho del buscador

**Opciones disponibles:**
- Todo (predeterminado)
- Noticias
- Concursos
- Encuestas
- Catálogo

**Características:**
- Icono: Filter (lucide-react)
- Label: "Tipo:" (visible solo en desktop)
- Muestra la opción seleccionada en el botón
- Dropdown con opciones resaltadas cuando están activas (fondo naranja claro)
- Se cierra automáticamente al seleccionar una opción
- Click fuera del dropdown lo cierra

### 3. Dropdown de Fecha

**Ubicación:** Header blanco, junto al dropdown de Tipo

**Opciones disponibles:**
- Todo (predeterminado, sin filtro de fecha)
- Últimos 7 días
- Este mes
- Mes pasado
- Rango (abre el DateRangePicker)

**Características:**
- Icono: Calendar (lucide-react)
- Label: "Fecha:" (visible solo en desktop)
- Muestra la opción seleccionada en el botón
- Dropdown con opciones resaltadas cuando están activas
- La opción "Rango" abre el DateRangePicker existente
- Lógica automática para calcular rangos de fechas predefinidos

### 4. Funcionalidad de Filtrado por Fecha

Se implementó un `useEffect` que convierte las selecciones de fecha predefinidas en rangos de fechas:

```typescript
useEffect(() => {
  if (!dateFilter) {
    setDateRangeStart(null);
    setDateRangeEnd(null);
    return;
  }

  const today = new Date('2026-03-26');
  let start: Date;
  let end: Date = today;

  switch (dateFilter) {
    case '7days':
      start = new Date(today);
      start.setDate(today.getDate() - 7);
      break;
    case 'thisMonth':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'lastMonth':
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case 'custom':
      return;
  }

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  setDateRangeStart(formatDate(start));
  setDateRangeEnd(formatDate(end));
}, [dateFilter]);
```

### 5. Manejo de Clicks Fuera de los Dropdowns

Se agregó un `useEffect` para cerrar los dropdowns cuando se hace click fuera de ellos:

```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
      setShowTypeDropdown(false);
    }
    if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
      setShowDateDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

### 6. Cambios en el Header

**Desktop:**
- Eliminado el botón "Filtrar" con DateRangePicker
- Los dropdowns están integrados directamente en el header al lado derecho del buscador
- DateRangePicker aparece debajo del header cuando se selecciona "Rango"
- Layout: `[Buscador] [Tipo Dropdown] [Fecha Dropdown] [Spacer] [Badge Puntos]`

**Mobile:**
- Buscador en una línea completa
- Dropdowns en una segunda línea, cada uno ocupando 50% del ancho (flex-1)
- Botones ajustados para ocupar todo el ancho disponible
- Las etiquetas "Tipo:" y "Fecha:" están ocultas para ahorrar espacio
- Los textos largos tienen truncate para evitar overflow
- DateRangePicker aparece debajo de los dropdowns cuando se selecciona "Rango"

### 7. Diseño Responsivo

Los dropdowns se adaptan a diferentes tamaños de pantalla:

**Desktop:**
```typescript
className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-all text-sm font-medium text-slate-700 shadow-sm"
```

**Mobile:**
```typescript
className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-full bg-white border border-slate-200 active:bg-slate-50 transition-all text-xs font-medium text-slate-700 shadow-sm"
```

**Características responsive:**
- Iconos: `w-3.5 h-3.5 md:w-4 md:h-4`
- Labels: `hidden md:inline`
- Gap: `gap-1.5 md:gap-2`
- Padding: `px-3 md:px-4 py-2 md:py-2.5`
- Font size: `text-xs md:text-sm`
- Mobile: width completo con `flex-1`
- Mobile: dropdown menu se extiende de `left-0` a `right-0` para ocupar todo el ancho del botón

## Flujo de Usuario

1. **Filtrar por Tipo:**
   - Click en dropdown "Tipo" en el header
   - Seleccionar una opción (Todo, Noticias, Concursos, Encuestas, Catálogo)
   - El dropdown se cierra automáticamente
   - Las publicaciones se filtran instantáneamente

2. **Filtrar por Fecha:**
   - Click en dropdown "Fecha" en el header
   - Seleccionar una opción predefinida (Últimos 7 días, Este mes, Mes pasado)
   - O seleccionar "Rango" para abrir el selector de rango personalizado debajo del header
   - El dropdown se cierra automáticamente
   - Las publicaciones se filtran según el rango de fechas

3. **Ambos Filtros Trabajan en Conjunto:**
   - Se pueden aplicar ambos filtros simultáneamente
   - Los filtros son acumulativos (AND lógico)
   - Ejemplo: "Concursos" + "Este mes" muestra solo concursos del mes actual

## Archivos Modificados

- `/src/components/Muro.tsx` - Componente principal con todos los cambios

## Iconos Utilizados

- `Filter` - Para el dropdown de Tipo
- `Calendar` - Para el dropdown de Fecha
- `ChevronDown` - Para indicar dropdown colapsable (con rotación cuando está abierto)

## Estilos y Diseño

- Botones con fondo blanco, borde gris claro
- Hover (desktop): borde más oscuro
- Active (mobile): fondo gris claro
- Sombra sutil para dar profundidad
- Dropdowns con sombra `shadow-lg` y bordes redondeados `rounded-xl`
- Opciones activas con fondo naranja claro (`bg-[#FF8000]/10`) y texto naranja
- Transiciones suaves en todas las interacciones
- Z-index de 50 para los dropdowns para asegurar que estén sobre otros elementos

## Beneficios de la Implementación

1. **Interfaz más limpia:** Los filtros están integrados en el header, no ocupan espacio adicional
2. **Mejor organización:** Filtros agrupados lógicamente junto al buscador
3. **Acceso rápido:** Siempre visibles en el header sticky
4. **Responsive:** Funciona perfectamente en desktop y mobile
5. **Accesible:** Click fuera cierra los dropdowns, fácil de usar
6. **Escalable:** Fácil agregar nuevas opciones de filtro en el futuro
7. **Consistente:** Sigue los patrones de diseño del resto de la aplicación
8. **Performante:** No afecta el rendimiento, filtrado instantáneo
9. **Intuitivo:** Posición junto al buscador hace evidente su función de filtrado
