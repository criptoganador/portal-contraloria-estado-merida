export interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  fecha: string;
  imagen: string;
  categoria: string;
}

export interface DocumentoLegal {
  id: number;
  titulo: string;
  fecha: string;
  categoria: 'Gaceta' | 'Resolución' | 'Providencia' | 'Circular';
  archivo: string;
}

export interface Contralor {
  nombre: string;
  cargo: string;
  biografia: string[];
  imagen: string;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface ContactFormData {
  nombre: string;
  cedula: string;
  correo: string;
  mensaje: string;
}

export interface Competencia {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface ValorInstitucional {
  titulo: string;
  descripcion: string;
  icono: string;
}
