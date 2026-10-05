// Modelo de un alojamiento (igual al JSON)
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
  imagenPrincipal: string;
  imagenes: string[];
  servicios: string[];
  reglas: string[];
}

// Estructura del archivo JSON
export interface MarketplaceData {
  alojamientos: Alojamiento[];
}
