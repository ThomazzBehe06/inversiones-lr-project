import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MonedaService } from '../../services/moneda.service';
import { Moneda } from '../../models/moneda';

@Component({
  imports: [RouterLink, RouterLinkActive, NgFor],
  selector: 'app-navbarcomponent',
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})
export class Navbarcomponent {
  menuAbierto: boolean = false;
  menuMoneda: boolean = false;

  constructor(private router: Router, public monedaService: MonedaService) {}

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

  alternarMenuMoneda(): void {
    this.menuMoneda = !this.menuMoneda;
  }

  cerrarMenuMoneda(): void {
    this.menuMoneda = false;
  }

  elegirMoneda(codigo: string): void {
    this.monedaService.cambiarMoneda(codigo);
    this.menuMoneda = false;
    this.cerrarMenu();
  }

  porCodigo(indice: number, m: Moneda): string {
    return m.codigo;
  }
}
