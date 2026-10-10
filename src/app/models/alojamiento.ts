export interface Alojamiento {
  id: number;
  nombre: string;
  descripcion: string;
  ciudad: string;
  ubicacion: string;
  tipo: string;
  categoria: string;
  destacado: boolean;
  capacidad: number;
  habitaciones: number;
  camas: number;
  banos: number;
  precioNoche: number;
  tarifaLimpieza: number;
  calificacion: number;
  activo: boolean;
  latitud?: number;
  longitud?: number;
  imagenPrincipal: string;
  imagenes: string[];
  servicios: string[];
  reglas: string[];
}

export interface Resena {
  id: number;
  alojamientoId: number;
  usuario: string;
  calificacion: number;
  comentario: string;
  foto?: string;
}

export interface MarketplaceData {
  alojamientos: Alojamiento[];
  resenas: Resena[];
}
