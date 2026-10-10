import { Routes } from '@angular/router';
import { Iniciocomponent } from './components/iniciocomponent/iniciocomponent';

export const routes: Routes = [
  { path: 'inicio', component: Iniciocomponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }
];
