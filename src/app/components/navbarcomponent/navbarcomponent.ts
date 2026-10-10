import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  // Rutas del HTML
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbarcomponent',
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})
export class Navbarcomponent {
  private router = inject(Router);

  // Menu en celulares
  protected menuAbierto = signal(false);

  // Abrir / cerrar menu
  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  // Buscador: va a /alojamientos?busqueda=...
  buscar(valor: string): void {
    const termino = valor.trim();
    this.router.navigate(['/alojamientos'], {
      queryParams: termino ? { busqueda: termino } : {},
    });
    this.cerrarMenu();
  }
}
