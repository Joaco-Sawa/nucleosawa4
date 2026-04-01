# Especificaciones de Imágenes - Desafío Sawa

## Resumen Ejecutivo

Este documento define el formato estándar de imágenes para el sistema de contenidos (noticias, encuestas y concursos) optimizado para tres contextos de visualización: carrusel hero, tarjetas de grid y vista de detalle.

---

## 1. Dimensiones Recomendadas

### Imagen Principal Universal
**Dimensión base: 1920 × 1080 px (16:9)**

Esta dimensión única funciona óptimamente en los tres contextos gracias al uso de `object-fit: cover` en CSS:

| Contexto | Relación de aspecto en UI | Comportamiento |
|----------|---------------------------|----------------|
| **Carrusel Hero** | 5:2 (móvil), 21:5 (desktop) | Recorte horizontal manteniendo centro |
| **Tarjetas Grid** | 28:9 | Recorte horizontal manteniendo centro |
| **Vista Detalle** | 16:9 (móvil), 21:9 (desktop) | Sin recorte (móvil) / recorte mínimo (desktop) |

### Justificación Técnica

- **16:9 es el estándar web y multimedia**: Compatible con YouTube, pantallas modernas y editores de imagen
- **Versatilidad mediante object-fit**: Una sola imagen se adapta automáticamente a todos los contenedores
- **Zona segura para elementos clave**: El centro 40% horizontal × 70% vertical siempre será visible en todos los contextos

---

## 2. Consideraciones de Composición

### Zona de Seguridad (Safe Area)
Para garantizar que los elementos importantes de la imagen sean siempre visibles:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│    ┌─────────────────────────────────────┐     │
│    │                                     │     │
│    │      ZONA SEGURA                    │     │
│    │      (40% × 70% centro)             │     │
│    │                                     │     │
│    │  • Rostros y elementos clave aquí  │     │
│    │                                     │     │
│    └─────────────────────────────────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Reglas de Composición

1. **Elementos importantes**: Mantener rostros, textos legibles y objetos clave dentro del 40% central horizontal
2. **Horizonte y líneas**: Alinear elementos horizontales importantes en el tercio medio vertical
3. **Degradado del carrusel**: Los 30% inferiores tendrán overlay oscuro, evitar texto crítico ahí
4. **Punto focal**: Colocar el punto de interés principal en el centro o ligeramente arriba del centro

---

## 3. Especificaciones Técnicas

### Tamaño y Formato

| Especificación | Valor Recomendado | Rango Aceptable |
|----------------|-------------------|-----------------|
| **Dimensiones** | 1920 × 1080 px | 1600-2400 × 900-1350 px |
| **Formato** | JPEG (alta calidad) | JPG, WebP |
| **Peso archivo** | 150-300 KB | 100-500 KB |
| **Calidad JPEG** | 80-85% | 75-90% |
| **Resolución** | 72 DPI (web) | 72 DPI |
| **Espacio de color** | sRGB | sRGB |

### Formato Alternativo: WebP

Para optimización avanzada (requiere conversión en backend):

| Especificación | Valor |
|----------------|-------|
| **Dimensiones** | 1920 × 1080 px |
| **Calidad WebP** | 75-80% |
| **Peso archivo** | 80-200 KB |
| **Fallback** | JPG obligatorio |

---

## 4. Implementación Responsive

### Estrategia de Carga

#### Desktop (> 768px)
```html
<img
  src="imagen-1920x1080.jpg"
  srcset="
    imagen-1920x1080.jpg 1920w,
    imagen-1280x720.jpg 1280w
  "
  sizes="100vw"
  alt="Descripción"
/>
```

#### Mobile (≤ 768px)
Cargar versión optimizada más ligera:
```html
<img
  src="imagen-1280x720.jpg"
  srcset="
    imagen-1280x720.jpg 1280w,
    imagen-960x540.jpg 960w
  "
  sizes="100vw"
  alt="Descripción"
/>
```

### Variantes de Imagen Recomendadas

Para implementación completa con optimización de ancho de banda:

| Variante | Dimensiones | Uso | Peso aprox. |
|----------|-------------|-----|-------------|
| **Desktop Full** | 1920 × 1080 | Desktop HD | 200-300 KB |
| **Desktop Estándar** | 1280 × 720 | Desktop estándar | 120-180 KB |
| **Mobile** | 960 × 540 | Smartphones | 80-120 KB |
| **Thumbnail** | 640 × 360 | Previews/caché | 40-60 KB |

---

## 5. Ajustes de Posicionamiento CSS

### object-position por Contexto

Actualmente implementado para casos especiales:

```css
/* Por defecto */
img {
  object-fit: cover;
  object-position: center center; /* 50% 50% */
}

/* Ajustes personalizados por contenido */
.imagen-id-1 { object-position: center 60%; } /* Mostrar más parte inferior */
.imagen-id-3 { object-position: center 40%; } /* Mostrar más parte superior */
```

### Cuándo Usar object-position

- **center 60%**: Cuando el elemento importante está en la parte superior de la imagen
- **center 40%**: Cuando el elemento importante está en la parte inferior
- **center 30-35%**: Para imágenes con cielo o espacio vacío arriba
- **center 65-70%**: Para imágenes con primer plano importante abajo

---

## 6. Mejores Prácticas

### Optimización de Carga

1. **Lazy loading**: Implementar `loading="lazy"` para imágenes fuera del viewport inicial
   ```html
   <img src="imagen.jpg" loading="lazy" alt="..." />
   ```

2. **Preload para Hero**: Precargar imagen del carrusel activo
   ```html
   <link rel="preload" as="image" href="hero-imagen-1.jpg" />
   ```

3. **Compresión**: Usar herramientas como TinyPNG, ImageOptim o Squoosh antes de subir

### Calidad Visual

1. **Nitidez**: Aplicar ligero sharpening (USM: radio 0.5, cantidad 50%)
2. **Contraste**: Aumentar ligeramente contraste para web (+5-10%)
3. **Saturación**: Reducir levemente saturación si es necesario (-5%)
4. **Exposición**: Priorizar detalles en sombras y medios tonos

### Accesibilidad

1. **Texto alternativo**: Siempre incluir `alt` descriptivo
2. **Contraste con overlays**: Asegurar legibilidad de texto sobre imágenes
3. **Indicadores visuales**: No depender solo del color para información crítica

---

## 7. Pipeline de Preparación de Imágenes

### Flujo de Trabajo Recomendado

```
1. CAPTURA/SELECCIÓN
   ↓ (imagen original, cualquier tamaño)

2. RECORTE Y COMPOSICIÓN
   ↓ (ajustar a 16:9, centrar elementos clave)

3. REDIMENSIONAMIENTO
   ↓ (exportar a 1920×1080)

4. OPTIMIZACIÓN DE COLOR
   ↓ (sRGB, ajuste de contraste/saturación)

5. COMPRESIÓN
   ↓ (JPEG 80-85%, target 150-300 KB)

6. VALIDACIÓN
   ↓ (revisar en los 3 contextos)

7. PUBLICACIÓN
```

### Herramientas Recomendadas

- **Edición**: Photoshop, Figma, Canva Pro
- **Redimensionamiento batch**: ImageMagick, XnConvert
- **Compresión**: TinyPNG, Squoosh.app, ImageOptim
- **Validación responsive**: Chrome DevTools, BrowserStack

---

## 8. Checklist de Pre-Publicación

Antes de publicar cualquier imagen, verificar:

- [ ] Dimensiones: 1920 × 1080 px (16:9)
- [ ] Formato: JPEG o WebP con fallback
- [ ] Peso: 150-300 KB (JPEG) o 80-200 KB (WebP)
- [ ] Calidad: 80-85% (JPEG) o 75-80% (WebP)
- [ ] Espacio de color: sRGB
- [ ] Elementos clave en zona segura (40% × 70% centro)
- [ ] Sin texto crítico en 30% inferior (overlay carrusel)
- [ ] Alt text descriptivo incluido
- [ ] Prueba visual en los 3 contextos (carrusel, cards, detalle)
- [ ] Prueba en mobile y desktop

---

## 9. Casos Especiales

### Imágenes Sin Rostros o Elementos Clave

Para imágenes abstractas, patrones o paisajes sin punto focal definido:
- Usar `object-position: center center` (default)
- Priorizar balance visual en toda la composición
- Evitar elementos importantes en los bordes

### Imágenes con Texto Integrado

Para imágenes que incluyen texto como parte del diseño:
- Mantener texto dentro de la zona segura
- Aumentar contraste del texto
- Probar legibilidad en el tamaño más pequeño (cards)
- Considerar agregar sombra o outline al texto

### Contenido Vertical (Infografías, Screenshots)

Si ocasionalmente se necesita contenido vertical:
- **Formato especial**: 1080 × 1920 (9:16)
- Agregar márgenes laterales para adaptar a 16:9
- Usar `object-fit: contain` en lugar de `cover`
- Fondo de relleno en color corporativo

---

## 10. Migración de Contenido Existente

### Para Imágenes Actuales con Formato Incorrecto

1. **Identificar**: Listar imágenes que no cumplen 1920×1080
2. **Priorizar**: Ordenar por importancia (featured > recientes > archivo)
3. **Convertir**:
   - Si imagen > 1920×1080: recortar y redimensionar
   - Si imagen < 1920×1080: upscaling con IA (Topaz Gigapixel) o reemplazar
4. **Reoptimizar**: Comprimir según especificaciones
5. **Actualizar**: Reemplazar en sistema manteniendo mismo nombre de archivo

### Script de Validación (Node.js ejemplo)

```javascript
const sharp = require('sharp');

async function validateImage(filePath) {
  const metadata = await sharp(filePath).metadata();
  const stats = await fs.stat(filePath);

  return {
    valid: metadata.width === 1920 && metadata.height === 1080,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: stats.size,
    sizeKB: Math.round(stats.size / 1024)
  };
}
```

---

## 11. Métricas de Éxito

### KPIs de Rendimiento

- **Tiempo de carga (LCP)**: < 2.5s para imagen hero
- **Peso total de página**: < 2 MB en carga inicial
- **Core Web Vitals**: Cumplir umbrales de Google
- **Tasa de error de carga**: < 1%

### Monitoreo

Implementar tracking de:
- Tiempo de carga de imágenes por contexto
- Errores 404 en imágenes
- Fallback a placeholder (imágenes rotas)
- Uso de ancho de banda por sesión

---

## Contacto y Soporte

Para dudas sobre implementación o casos especiales no cubiertos en este documento, contactar al equipo de desarrollo o diseño.

**Última actualización**: Marzo 2026
**Versión**: 1.0
**Responsable**: Equipo de Desarrollo Web
