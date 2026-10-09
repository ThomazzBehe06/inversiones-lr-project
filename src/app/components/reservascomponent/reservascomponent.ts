import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Reserva {
  id: string;
  titulo: string;
  ubicacion: string;
  fechas: string;
  duracion: string;
  huespedes: string;
  total: string;
  estado: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-reservascomponent',
  imports: [CommonModule],
  templateUrl: './reservascomponent.html',
  styleUrl: './reservascomponent.css',
})
export class Reservascomponent {
  reserva: Reserva = {
    id: '1',
    titulo: 'Loft Moderno en Chapinero',
    ubicacion: 'Bogotá, Colombia',
    fechas: 'Del 15 al 18 de Noviembre',
    duracion: '3 noches / 4 días',
    huespedes: '2 adultos',
    total: '$649,000',
    estado: 'CONFIRMADA',
    imagenUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  };
}
