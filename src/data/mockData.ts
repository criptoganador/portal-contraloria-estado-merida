import type { Noticia, DocumentoLegal, Contralor, NavLink, Competencia, ValorInstitucional } from '../types';

// ─── Navegación ───────────────────────────────────────────────
export const navLinks: NavLink[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Institución', path: '/institucion' },
  { label: 'Competencias', path: '/competencias' },
  { label: 'Marco Legal', path: '/marco-legal' },
  { label: 'Prensa', path: '/prensa' },
  { label: 'Contacto', path: '/contacto' },
];

// ─── Noticias ─────────────────────────────────────────────────
export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: 'Contraloría inicia auditoría a la gestión fiscal del ejercicio 2025',
    resumen: 'El órgano contralor dio inicio a las actuaciones de control fiscal correspondientes al ejercicio económico financiero 2025, abarcando los entes y organismos del poder público estadal.',
    fecha: '2026-05-15',
    imagen: '/images/noticia-1.jpg',
    categoria: 'Auditoría',
  },
  {
    id: 2,
    titulo: 'Jornada de capacitación sobre rendición de cuentas para funcionarios públicos',
    resumen: 'Se llevó a cabo una jornada de formación dirigida a los responsables de la administración activa sobre los procesos de rendición de cuentas ante el órgano contralor estadal.',
    fecha: '2026-05-10',
    imagen: '/images/noticia-2.jpg',
    categoria: 'Formación',
  },
  {
    id: 3,
    titulo: 'Publicada la Resolución de Normas para la Declaración Jurada de Patrimonio',
    resumen: 'La Contraloría del Estado Mérida publica las normas actualizadas que regulan la presentación de la Declaración Jurada de Patrimonio por parte de los funcionarios públicos estadales.',
    fecha: '2026-05-05',
    imagen: '/images/noticia-3.jpg',
    categoria: 'Normativa',
  },
  {
    id: 4,
    titulo: 'Contraloría promueve la participación ciudadana en el control fiscal',
    resumen: 'El organismo contralor realizó talleres comunitarios en distintos municipios del estado para promover la contraloría social y la participación activa de los ciudadanos.',
    fecha: '2026-04-28',
    imagen: '/images/noticia-4.jpg',
    categoria: 'Participación',
  },
  {
    id: 5,
    titulo: 'Informe anual de gestión 2025 presentado ante el Consejo Legislativo',
    resumen: 'El Contralor del Estado presentó formalmente el Informe Anual de Gestión correspondiente al año 2025 ante el Consejo Legislativo del Estado Mérida.',
    fecha: '2026-04-20',
    imagen: '/images/noticia-5.jpg',
    categoria: 'Institucional',
  },
  {
    id: 6,
    titulo: 'Mesa de trabajo interinstitucional sobre transparencia y gobierno abierto',
    resumen: 'Representantes de diversos órganos del poder público estadal se reunieron para articular estrategias conjuntas en materia de transparencia, acceso a la información y gobierno abierto.',
    fecha: '2026-04-15',
    imagen: '/images/noticia-6.jpg',
    categoria: 'Institucional',
  },
];

// ─── Documentos Legales ───────────────────────────────────────
export const documentosLegales: DocumentoLegal[] = [
  {
    id: 1,
    titulo: 'Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal',
    fecha: '2024-12-15',
    categoria: 'Gaceta',
    archivo: '#',
  },
  {
    id: 2,
    titulo: 'Resolución N° 001-2026 - Normas para la Rendición de Cuentas',
    fecha: '2026-01-20',
    categoria: 'Resolución',
    archivo: '#',
  },
  {
    id: 3,
    titulo: 'Providencia Administrativa N° 012 - Declaración Jurada de Patrimonio',
    fecha: '2026-02-10',
    categoria: 'Providencia',
    archivo: '#',
  },
  {
    id: 4,
    titulo: 'Constitución del Estado Bolivariano de Mérida',
    fecha: '2023-06-01',
    categoria: 'Gaceta',
    archivo: '#',
  },
  {
    id: 5,
    titulo: 'Resolución N° 003-2026 - Procedimiento de Determinación de Responsabilidades',
    fecha: '2026-03-05',
    categoria: 'Resolución',
    archivo: '#',
  },
  {
    id: 6,
    titulo: 'Circular N° 001-2026 - Lineamientos para el Control Previo',
    fecha: '2026-01-15',
    categoria: 'Circular',
    archivo: '#',
  },
  {
    id: 7,
    titulo: 'Reglamento Interno de la Contraloría del Estado Mérida',
    fecha: '2024-08-20',
    categoria: 'Gaceta',
    archivo: '#',
  },
  {
    id: 8,
    titulo: 'Providencia Administrativa N° 025 - Control de Bienes Públicos',
    fecha: '2025-11-30',
    categoria: 'Providencia',
    archivo: '#',
  },
];

// ─── Contralor ────────────────────────────────────────────────
export const contralor: Contralor = {
  nombre: 'Abg. María Elena Rodríguez Peña',
  cargo: 'Contralora del Estado Mérida',
  biografia: [
    'Abogada egresada de la Universidad de Los Andes (ULA), con especialización en Derecho Administrativo y Gestión Pública. Cuenta con más de 20 años de experiencia en el ámbito del control fiscal y la administración pública.',
    'Ha desempeñado cargos de alta responsabilidad en diversos organismos del Estado, destacándose por su compromiso con la transparencia, la rendición de cuentas y el fortalecimiento institucional.',
    'Bajo su gestión, la Contraloría del Estado Mérida ha implementado programas de modernización tecnológica y fortalecimiento del control fiscal participativo, promoviendo la cercanía con el ciudadano.',
  ],
  imagen: '/images/contralor.jpg',
};

// ─── Competencias ─────────────────────────────────────────────
export const competencias: Competencia[] = [
  {
    id: 1,
    titulo: 'Control Fiscal',
    descripcion: 'Ejercer el control, la vigilancia y la fiscalización de los ingresos, gastos y bienes del Estado Mérida, así como de las operaciones relativas a los mismos.',
    icono: 'Shield',
  },
  {
    id: 2,
    titulo: 'Auditorías',
    descripcion: 'Realizar auditorías, inspecciones y cualquier tipo de revisión fiscal a los órganos y entidades sujetos a su control.',
    icono: 'Search',
  },
  {
    id: 3,
    titulo: 'Determinación de Responsabilidades',
    descripcion: 'Iniciar, sustanciar y decidir los procedimientos administrativos para la determinación de responsabilidades de los funcionarios públicos.',
    icono: 'Scale',
  },
  {
    id: 4,
    titulo: 'Declaración Jurada de Patrimonio',
    descripcion: 'Recibir y examinar las declaraciones juradas de patrimonio que deben presentar los funcionarios públicos del Estado.',
    icono: 'FileText',
  },
  {
    id: 5,
    titulo: 'Potestad Investigativa',
    descripcion: 'Ejercer la potestad investigativa para verificar la legalidad, exactitud, sinceridad y corrección de las operaciones y acciones administrativas.',
    icono: 'Eye',
  },
  {
    id: 6,
    titulo: 'Control Previo',
    descripcion: 'Ejercer el control previo sobre los compromisos y pagos del Poder Ejecutivo Estadal cuando la ley así lo establezca.',
    icono: 'ClipboardCheck',
  },
  {
    id: 7,
    titulo: 'Rendición de Cuentas',
    descripcion: 'Examinar y evaluar las cuentas que deben rendir los administradores y custodios de fondos y bienes del patrimonio público estadal.',
    icono: 'BarChart3',
  },
  {
    id: 8,
    titulo: 'Participación Ciudadana',
    descripcion: 'Fomentar la participación ciudadana en el ejercicio del control fiscal a través de la contraloría social y la atención de denuncias.',
    icono: 'Users',
  },
];

// ─── Valores Institucionales ──────────────────────────────────
export const valoresInstitucionales: ValorInstitucional[] = [
  {
    titulo: 'Misión',
    descripcion: 'Ejercer el control fiscal sobre los ingresos, gastos y bienes del Estado Mérida, con transparencia, eficiencia y apego a la legalidad, contribuyendo al fortalecimiento de la gestión pública y la participación ciudadana.',
    icono: 'Target',
  },
  {
    titulo: 'Visión',
    descripcion: 'Ser un órgano de control fiscal modelo a nivel nacional, reconocido por su excelencia, integridad y compromiso con la transparencia en la gestión de los recursos públicos del Estado Mérida.',
    icono: 'Compass',
  },
  {
    titulo: 'Valores',
    descripcion: 'Transparencia, ética, responsabilidad, compromiso social, legalidad, imparcialidad, profesionalismo y vocación de servicio público.',
    icono: 'Heart',
  },
];
