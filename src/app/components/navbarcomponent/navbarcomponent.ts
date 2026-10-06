import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbarcomponent',
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})
export class Navbarcomponent {
  menuAbierto: boolean = false;

  constructor(private router: Router) {}

  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  buscar(texto: string): void {
    const busqueda = texto.trim();
    this.router.navigate(['/alojamientos'], {
      queryParams: busqueda ? { busqueda: busqueda } : {},
    });
    this.cerrarMenu();
  }
}
