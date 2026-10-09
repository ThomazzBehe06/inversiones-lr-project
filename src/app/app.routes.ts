import { Routes } from '@angular/router';
import { Iniciocomponent } from './components/iniciocomponent/iniciocomponent';
import { Alojamientoscomponent } from './components/alojamientoscomponent/alojamientoscomponent';
import { Reservascomponent } from './components/reservascomponent/reservascomponent';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Iniciocomponent },
  { path: 'alojamientos', component: Alojamientoscomponent },
  {path: 'reservas', component: Reservascomponent},
];
