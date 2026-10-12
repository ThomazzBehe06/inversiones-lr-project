import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Iniciocomponent} from './components/iniciocomponent/iniciocomponent';
import {Alojamientoscomponent} from './components/alojamientoscomponent/alojamientoscomponent';
import {Detallealojamientocomponent} from './components/detallealojamientocomponent/detallealojamientocomponent';
import {Reservascomponent} from './components/reservascomponent/reservascomponent';
import {Logincomponent} from './components/logincomponent/logincomponent';
import {Noencontradocomponent} from './components/noencontradocomponent/noencontradocomponent';

const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
  {path: 'inicio', component: Iniciocomponent},
  {path: 'alojamientos/:id', component: Detallealojamientocomponent},
  {path: 'alojamientos', component: Alojamientoscomponent},
  {path: 'reservas', component: Reservascomponent},
  {path: 'login', component: Logincomponent},

  // Ruta que no existe
  {path: '**', component: Noencontradocomponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'top', anchorScrolling: 'enabled'}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
