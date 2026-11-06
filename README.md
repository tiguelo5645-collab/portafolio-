# Portafolio de Miguel Ángel Pantoja Guerra

Sitio personal de un estudiante de Ingeniería de Software en Pasto, Colombia. Muestra cuatro proyectos como casos de estudio (una app para reloj y teléfono, una API con su app web, una app móvil con IA y un videojuego), la trayectoria y un formulario de contacto que funciona.

El inicio es una pizarra táctica de fútbol: cada proyecto ocupa una posición en la cancha y al elegir una se dibuja el pase y aparece el proyecto. Funciona con mouse, toque y teclado.

## Stack y por qué

| Pieza      | Elección                                              | Por qué                                                                                                                                                                |
| ---------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework  | [Astro 7](https://astro.build)                        | El sitio es casi todo contenido: Astro lo genera como HTML estático y solo manda JavaScript donde hay interacción.                                                     |
| Lenguaje   | TypeScript estricto (`astro/tsconfigs/strictest`)     | Errores en el editor, no en producción.                                                                                                                                |
| Estilos    | CSS propio con variables                              | Los tokens de diseño viven en un solo archivo ([src/styles/tokens.css](src/styles/tokens.css)); cada componente trae su CSS con alcance propio. Sin frameworks de CSS. |
| Tipografía | Archivo variable, autoalojada con Fontsource          | Una sola familia; su eje de ancho hace de segunda fuente. Sin peticiones a Google Fonts.                                                                               |
| Contenido  | Colecciones de Astro (Markdown) y un archivo de datos | Agregar un proyecto o cambiar un texto no toca componentes.                                                                                                            |
| Formulario | Función serverless en Vercel + API de Resend          | El resto del sitio es estático; solo `/api/contacto` corre en el servidor. Sin SDK: un `fetch`.                                                                        |
| Pruebas    | Playwright                                            | Pruebas de punta a punta en escritorio y móvil, con el Edge o Chrome instalado.                                                                                        |
| Calidad    | ESLint, Prettier, `astro check`                       | Lint, formato y tipos.                                                                                                                                                 |

Dependencias de producción: `astro`, `@astrojs/vercel`, `@astrojs/sitemap` y `@fontsource-variable/archivo`. Nada más.

## Correrlo en tu computador

Necesitas Node.js 20 o superior.

```bash
npm install
npm run dev            # http://localhost:4321
```

Otros comandos:

```bash
npm run build          # revisa tipos y genera el sitio
npm run lint           # ESLint
npm run format         # Prettier
npm run test:e2e       # pruebas de Playwright (levanta el servidor solo)
npm run imagenes       # regenera public/og.png y los íconos (con `npm run dev` corriendo)
```

Las pruebas usan Microsoft Edge (`PW_CHANNEL=msedge`, el valor por defecto). Para usar Chrome: `PW_CHANNEL=chrome npm run test:e2e`.

## Estructura

```
src/
├── components/      Hero (con marcador), Cancha (pizarra táctica), ListaProyectos, ComoTrabajo, SobreMi, Trayectoria, Contacto…
├── content/
│   └── proyectos/   Un archivo .md por proyecto: datos arriba, caso de estudio abajo
├── data/perfil.ts   Datos personales, "Ahora mismo", trayectoria y tecnologías
├── layouts/         Base.astro: <head>, SEO, Open Graph, tema
├── lib/             Lógica compartida (validación del formulario, consultas de proyectos)
├── pages/           Rutas: inicio, /proyectos/[slug], /cv, 404, /api/contacto
├── scripts/         Scripts de cliente compartidos
└── styles/          tokens.css (diseño) y base.css (reset y utilidades)
tests/               Pruebas de Playwright
docs/design-plan.md  Plan de diseño: tokens, retícula, principios y decisiones
```

## Editar el contenido

### Actualizar "Ahora mismo"

En [src/data/perfil.ts](src/data/perfil.ts), cambia `ahoraMismo.items` y la fecha de `ahoraMismo.actualizado`.

### Agregar un proyecto

1. Crea `src/content/proyectos/mi-proyecto.md`. El nombre del archivo es la URL: `/proyectos/mi-proyecto`.
2. Copia el frontmatter de un proyecto existente y llénalo. Los campos obligatorios están en [src/content.config.ts](src/content.config.ts): si falta uno, `npm run build` dice cuál.
3. Pon las capturas en `src/assets/proyectos/mi-proyecto/` y enlázalas en `portada` y `galeria`. Astro las convierte a WebP con varios tamaños.
4. Escribe el caso de estudio con estas secciones `##`: El problema, Mi papel, Decisiones técnicas, Arquitectura (una lista numerada, que se dibuja como diagrama), Resultado y Qué aprendí.
5. Para que aparezca en la cancha del inicio, agrega su posición y su dorsal en `posiciones` dentro de [src/data/cancha.ts](src/data/cancha.ts). La cancha y las tarjetas de proyectos lo leen de ahí.
6. Enlaza las tecnologías con el proyecto en `tecnologias.enProyectos` de [src/data/perfil.ts](src/data/perfil.ts).

### Trayectoria, tecnologías y textos

Todo está en [src/data/perfil.ts](src/data/perfil.ts). Hay entradas comentadas listas para el hackathon y el curso del SENA.

## Variables de entorno

Copia `.env.example` a `.env` para desarrollo. En Vercel se configuran en _Settings → Environment Variables_.

| Variable         | Para qué                                                                      | Obligatoria                                                              |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `RESEND_API_KEY` | Llave de [Resend](https://resend.com) para enviar los mensajes del formulario | No: sin ella el formulario dice que no está conectado y muestra el email |
| `CONTACT_TO`     | Email que recibe los mensajes                                                 | No (por defecto, el email del perfil)                                    |
| `CONTACT_FROM`   | Remitente verificado en Resend                                                | No (por defecto, `onboarding@resend.dev`)                                |
| `SITE_URL`       | URL pública, para el sitemap, la URL canónica y Open Graph                    | No (por defecto, la de Vercel)                                           |

El formulario tiene validación en el navegador y en el servidor (la misma función, [src/lib/contacto.ts](src/lib/contacto.ts)), un campo trampa para bots, un tiempo mínimo de envío y un límite de 5 mensajes cada 10 minutos por IP. Ese límite vive en la memoria de cada instancia de la función: frena ráfagas, pero no es global. Para un límite estricto, usa un almacén compartido como Upstash Redis.

## Desplegar en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel detecta Astro solo; no hay que cambiar nada.
3. Agrega las variables de entorno de la tabla de arriba.
4. Cada `git push` a `main` publica una versión nueva.

[vercel.json](vercel.json) agrega cabeceras de seguridad (sin `iframe` ajeno, sin rastreo del referer completo, sin cámara ni micrófono) y caché larga para los archivos con hash de `/_astro`.

### Conectar un dominio propio

1. En Vercel, abre el proyecto → _Settings → Domains_ → agrega el dominio (por ejemplo `miguelpantoja.dev`).
2. En el proveedor del dominio, crea los registros DNS que Vercel te muestra (un `A` a `76.76.21.21` para el dominio raíz, o un `CNAME` a `cname.vercel-dns.com` para `www`).
3. Cambia `SITE_URL` al dominio nuevo y vuelve a publicar, para que el sitemap y las imágenes para compartir usen la URL correcta.

## Accesibilidad y rendimiento

- Contraste WCAG AA en los dos temas (Día y Noche); los valores medidos están en el plan de diseño.
- Navegable con teclado, foco visible, enlace "Saltar al contenido" y menú móvil con el foco atrapado y cierre con Escape.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`.
- Funciona sin JavaScript: el formulario envía y muestra el resultado en `/mensaje-enviado`.
- Imágenes en WebP con tamaños responsivos y carga diferida; fuente precargada con `font-display: swap`.

## Licencia

El código es de uso libre como referencia. Los textos, la foto y las capturas de los proyectos son de Miguel Ángel Pantoja Guerra.
