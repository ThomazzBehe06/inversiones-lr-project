import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-noencontradocomponent',
  standalone: false,
  styleUrl: './noencontradocomponent.css',
  templateUrl: './noencontradocomponent.html',
})
export class Noencontradocomponent {
  // Ruta que escribio el usuario
  ruta = inject(Router).url;
}
