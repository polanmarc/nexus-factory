# Nexus Factory

Experiencia web interactiva que representa una fábrica industrial en perspectiva isométrica. Permite recorrer las distintas áreas del complejo, acercarse a cada zona y consultar la información de sus equipos y procesos.

## Vista general

Nexus Factory convierte el plano de una fábrica en una interfaz visual exploratoria. Cada edificio funciona como una zona navegable y contiene elementos interactivos, como cintas transportadoras, robots, maquinaria CNC, estanterías, grúas, laboratorios y muelles de carga.

La interfaz está pensada para mostrar información operativa de forma visual, con transiciones suaves y animaciones que ayudan a entender el funcionamiento de cada área.

## Funcionalidades

- Mapa isométrico de la fábrica renderizado en SVG.
- Cinco zonas explorables: Producción, Almacén, Oficinas, Laboratorio y Logística.
- Zoom con controles en pantalla y con la rueda del ratón.
- Desplazamiento del mapa mediante arrastre.
- Navegación rápida entre zonas desde la barra superior y el minimapa.
- Animaciones para cintas transportadoras, robots, prensas, grúas, indicadores de estado y otros equipos.
- Selección de equipos con enfoque automático y panel de información contextual.
- Breadcrumbs para volver a la vista general o cambiar de nivel de navegación.
- Diseño responsive para adaptarse a distintas resoluciones.
- Interfaz oscura con acentos de color por zona.

## Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- SVG para la escena isométrica

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

Clona el repositorio y entra en su directorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd interactive-factory
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará en la terminal la URL local, normalmente `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo con recarga en caliente
npm run build     # Compila la aplicación para producción
npm run preview   # Sirve localmente la compilación de producción
npm run lint      # Ejecuta ESLint
npm run typecheck # Comprueba los tipos de TypeScript
```

## Cómo usar la interfaz

1. Selecciona una zona desde la barra superior, el mapa o el minimapa.
2. Haz clic en un equipo para acercarte y abrir su información.
3. Usa la rueda del ratón o los controles laterales para cambiar el zoom.
4. Arrastra el mapa para desplazarte por la escena.
5. Utiliza el botón de inicio para regresar a la vista general.

## Estructura del proyecto

```text
src/
├── components/
│   ├── factory/       # Escena isométrica y elementos animados
│   └── ui/            # Navegación, minimapa, controles y paneles
├── data/
│   └── zones.ts       # Zonas, equipos, estadísticas y textos
├── hooks/
│   └── useCamera.ts   # Zoom, desplazamiento y animaciones de cámara
├── types/
│   └── index.ts       # Tipos de zonas, equipos y cámara
├── utils/
│   └── iso.ts         # Conversión y geometría isométrica
├── App.tsx            # Composición principal de la experiencia
└── main.tsx           # Punto de entrada de React
```

## Personalización

La mayor parte del contenido visual se configura desde [`src/data/zones.ts`](src/data/zones.ts). Desde ese archivo puedes:

- Añadir o eliminar zonas.
- Cambiar nombres, descripciones, colores y estadísticas.
- Incorporar nuevos equipos dentro de una zona.
- Ajustar el tipo de elemento, su posición y tamaño.
- Configurar animaciones y su velocidad.

Los componentes de la escena se encuentran en [`src/components/factory`](src/components/factory) y los controles de interfaz en [`src/components/ui`](src/components/ui).

## Compilación y despliegue

Genera la versión optimizada para producción con:

```bash
npm run build
```

El resultado se crea en la carpeta `dist/`, que puedes publicar en cualquier servicio compatible con aplicaciones estáticas, como GitHub Pages, Netlify, Vercel o Cloudflare Pages.

Para revisar la compilación localmente:

```bash
npm run preview
```

## Licencia

Este proyecto se distribuye bajo la licencia que defina el repositorio.
