import { Routes } from '@angular/router';
import { Iniciocomponent } from './components/iniciocomponent/iniciocomponent';
import { Alojamientoscomponent } from './components/alojamientoscomponent/alojamientoscomponent';
import { Detallealojamientocomponent } from './components/detallealojamientocomponent/detallealojamientocomponent';
import { Reservascomponent } from './components/reservascomponent/reservascomponent';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Iniciocomponent },
  { path: 'alojamientos/:id', component: Detallealojamientocomponent },
  { path: 'alojamientos', component: Alojamientoscomponent },
  {path: 'reservas', component: Reservascomponent},
];
