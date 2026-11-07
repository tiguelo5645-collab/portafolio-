/**
 * Datos personales y textos del sitio. Edita aquí sin tocar componentes.
 * Los proyectos viven en src/content/proyectos/*.md.
 */

export const perfil = {
  nombre: 'Miguel Ángel Pantoja Guerra',
  nombreCorto: 'Miguel Pantoja',
  rol: 'Estudiante de Ingeniería de Software',
  ciudad: 'Pasto, Colombia',
  email: 'miguelpantojag03@gmail.com',
  github: 'https://github.com/miguelpantojag03',
  linkedin: 'https://www.linkedin.com/in/miguel-%C3%A1ngel-pantoja-guerra-b5a0b5428',
  universidad: 'Universidad Cooperativa de Colombia',
  semestre: 'quinto semestre',
  grado: 'mayo de 2028',

  /** Frase de qué hace: una línea, con hechos. */
  queHago: 'Construyo apps completas: del reloj al servidor.',
  disponibilidad: 'Disponible para proyectos freelance, remoto o presencial.',

  /** Descripción para buscadores y redes (máx. ~155 caracteres). */
  descripcion:
    'Miguel Ángel Pantoja, estudiante de Ingeniería de Software en Pasto, Colombia. Apps para reloj, móvil, web y videojuegos. Disponible para freelance.',
} as const;

/** Sobre mí: párrafos en primera persona. */
export const historia: string[] = [
  'Soy de Pasto. Desde pequeño me la pasaba en el computador, y aprendí HTML y CSS por mi cuenta antes de saber que eso se podía estudiar.',
  'Hoy estudio Ingeniería de Software en la Universidad Cooperativa de Colombia. Me gusta entender el sistema completo: la pantalla que alguien toca, la API que responde y la base de datos que guarda todo. Por eso mis proyectos van del reloj al servidor, y hasta un videojuego.',
  'Gané un hackathon. Fuera del código juego fútbol, dibujo y toco la guitarra.',
];

/** Lo que estoy haciendo ahora. Actualízalo cada mes o dos. */
export const ahoraMismo = {
  actualizado: 'Noviembre de 2026',
  items: [
    'Cursando el quinto semestre de Ingeniería de Software.',
    'Preparando HP para probarlo en un reloj Wear OS de verdad.',
    'Ampliando Ascua con nuevas zonas de la ciudad.',
  ],
};

export type ItemTrayectoria = {
  fecha: string;
  /** Fecha en formato ISO para <time datetime>. */
  iso: string;
  titulo: string;
  detalle: string;
  /** Si es true, todavía no pasó (grado estimado). */
  previsto?: boolean;
};

/** Trayectoria: de lo más reciente a lo más antiguo. */
export const trayectoria: ItemTrayectoria[] = [
  {
    fecha: 'Mayo de 2028',
    iso: '2028-05',
    titulo: 'Grado como ingeniero de software',
    detalle: 'Fecha estimada. Universidad Cooperativa de Colombia.',
    previsto: true,
  },
  {
    fecha: 'Segundo semestre de 2026',
    iso: '2026-10',
    titulo: 'Quinto semestre y cuatro proyectos',
    detalle:
      'Construí HP (reloj y teléfono), PrestaLab (API y web), Kalma (app móvil con IA) y Ascua (videojuego en Unity).',
  },
  // Completa y descomenta cuando tengas los datos del hackathon:
  // {
  //   fecha: 'Mes de AAAA',
  //   iso: 'AAAA-MM',
  //   titulo: 'Ganador del hackathon NOMBRE',
  //   detalle: 'Qué construimos, mi papel y el premio.',
  // },
  {
    fecha: 'Segundo semestre de 2024',
    iso: '2024-08',
    titulo: 'Empecé Ingeniería de Software',
    detalle: 'Universidad Cooperativa de Colombia, en Pasto.',
  },
  {
    fecha: '2023 a 2024',
    iso: '2023',
    titulo: 'Dos semestres de Ingeniería Ambiental',
    detalle:
      'Universidad de Nariño. Después me cambié a Ingeniería de Software para dedicarme a lo que siempre me gustó: programar.',
  },
  // Curso del SENA: completa y descomenta cuando tengas los datos.
  // {
  //   fecha: 'AAAA',
  //   iso: 'AAAA',
  //   titulo: 'Curso de programación en el SENA',
  //   detalle: 'Nombre del curso, duración y qué aprendí.',
  // },
  {
    fecha: 'Desde pequeño',
    iso: '2010',
    titulo: 'HTML y CSS por mi cuenta',
    detalle: 'Mis primeras páginas, antes de entrar a la universidad.',
  },
];

export type Tecnologia = {
  nombre: string;
  /** Slugs de proyectos en src/content/proyectos donde la usé. */
  proyectos?: string[];
  nota?: string;
};

/**
 * Habilidades contadas por evidencia, no por porcentaje.
 * "enProyectos": tecnologías que aparecen en un proyecto publicado aquí.
 * "fueraDeProyectos": las he usado, pero no en estos cuatro proyectos.
 * "aprendiendo": lo que estoy aprendiendo ahora (si queda vacío, no se muestra).
 */
export const tecnologias: {
  enProyectos: Tecnologia[];
  fueraDeProyectos: Tecnologia[];
  aprendiendo: Tecnologia[];
} = {
  enProyectos: [
    { nombre: 'Java', proyectos: ['prestalab'] },
    { nombre: 'Spring Boot', proyectos: ['prestalab'] },
    { nombre: 'Kotlin y Jetpack Compose', proyectos: ['hp'] },
    { nombre: 'Wear OS', proyectos: ['hp'] },
    { nombre: 'TypeScript', proyectos: ['kalma'] },
    { nombre: 'React', proyectos: ['prestalab'] },
    { nombre: 'React Native y Expo', proyectos: ['kalma'] },
    { nombre: 'C# y Unity', proyectos: ['ascua'] },
    { nombre: 'PostgreSQL', proyectos: ['prestalab', 'hp', 'kalma'] },
    { nombre: 'Supabase', proyectos: ['hp', 'kalma'] },
    { nombre: 'Docker', proyectos: ['prestalab'] },
    { nombre: 'Postman', proyectos: ['prestalab'] },
    { nombre: 'Git, GitHub y GitHub Actions', proyectos: ['prestalab', 'hp', 'kalma', 'ascua'] },
    { nombre: 'HTML y CSS', nota: 'Este portafolio' },
  ],
  fueraDeProyectos: [
    { nombre: 'Python' },
    { nombre: 'Django' },
    { nombre: 'MySQL' },
    { nombre: 'Tailwind CSS' },
    { nombre: 'Vercel' },
    { nombre: 'AWS' },
  ],
  aprendiendo: [],
};

/** Pasatiempos: lo que hago fuera del código. Se muestran en la sección «Fuera del código». */
export const pasatiempos: { titulo: string; texto: string }[] = [
  {
    titulo: 'Fútbol',
    texto: 'Lo juego y lo veo siempre que puedo. De ahí viene la cancha de este sitio.',
  },
  { titulo: 'Dibujo', texto: 'Dibujo por gusto.' },
  { titulo: 'Guitarra', texto: 'Toco la guitarra.' },
];

/** Cómo trabajo: hábitos que se pueden comprobar en los repositorios. */
export const formaDeTrabajo = [
  {
    titulo: 'Escribo las decisiones',
    texto:
      'Cada decisión importante queda escrita con la alternativa que descarté y por qué. PrestaLab tiene siete ADR; Kalma, más de 80 decisiones de diseño.',
  },
  {
    titulo: 'Construyo por fases',
    texto:
      'Primero algo que funcione de punta a punta, luego capas. Cada fase termina en un commit que se puede probar.',
  },
  {
    titulo: 'Pruebo lo que puede romperse',
    texto:
      'Pruebas de dominio, de arquitectura y de integración con una base de datos real. También pruebo el contraste de colores y la seguridad entre cuentas.',
  },
];
