# La Boutique de las Uñas — Web (long page)

Web estática lista para subir a GitHub y desplegar en Vercel. Misma estructura que la del psiquiatra: un `index.html`, una carpeta `css/` y una carpeta `images/`.

```
web/
├── index.html
├── css/
│   └── styles.css
└── images/
    ├── hero.jpg     ← imagen de muestra, reemplazar
    └── monica.jpg   ← imagen de muestra, reemplazar
```

## Lo que tienes que hacer antes de publicar

1. **Reemplazar las imágenes.** `hero.jpg` y `monica.jpg` son de muestra. Sustitúyelas por fotos reales de Mónica y de su trabajo **manteniendo el mismo nombre de archivo** (o cambia la ruta en el `index.html`). Recomendado: hero en vertical (~600×720) y Mónica (~520×620). Fotos reales, no de banco de imágenes.
2. **Revisar el horario** del schema (`index.html`, bloque `openingHoursSpecification`): ahora pone L-V 10-20 y S 10-14. Ajústalo al horario real.
3. **Confirmar precios** con Mónica (tomados de Booksy a junio 2026).
4. **Dominio:** cambia `https://www.laboutiquedelasunas.es/` en las etiquetas `canonical`, `og:` y el schema por el dominio definitivo.

## Pendientes de configuración (de la reunión de revisión)

- **GEO:** reclamar Bing Places y Apple Business Connect; mantener NAP idéntico en web, Google, Booksy y Fresha.
- **Medición:** conectar Google Analytics 4 y marcar como conversión los clics en WhatsApp, en "Llamar" (tel:) y en "Reservar" (Booksy/Fresha).

## Desplegar en Vercel

**Opción rápida (sin instalar nada):**
1. Sube el contenido de la carpeta `web/` a un repositorio nuevo de GitHub (que `index.html` quede en la raíz del repo).
2. Entra en vercel.com → *Add New Project* → importa el repo.
3. Framework preset: *Other*. No hace falta build. Deploy.

**Con Vercel CLI:**
```bash
cd web
npx vercel        # primera vez, sigue el asistente
npx vercel --prod # publicar en producción
```

## Detalles técnicos incluidos

- Responsive (móvil, tablet, escritorio) con menú hamburguesa.
- Botón de WhatsApp dominante + flotante fijo en móvil (`wa.me/34669981057`).
- CTAs secundarios: reserva en Booksy y llamada (`tel:`).
- Schema `NailSalon` (JSON-LD) con NAP, geo, horario, precio y reseñas.
- H2 de servicios con keyword + ciudad para SEO local.
- FAQ con acordeón nativo (funciona sin JavaScript).
- Tipografías de Google Fonts (Playfair Display + Manrope).
- Mapa de Google embebido (sin API key).

Sin dependencias ni build. Todo carga directo.
