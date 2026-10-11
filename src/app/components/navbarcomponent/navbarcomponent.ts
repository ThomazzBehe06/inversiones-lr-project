import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MonedaService } from '../../services/moneda.service';
import { SesionService } from '../../services/sesion.service';
import { Moneda } from '../../models/moneda';

@Component({
  selector: 'app-navbarcomponent',
  standalone: false,
  styleUrl: './navbarcomponent.css',
  templateUrl: './navbarcomponent.html',
})

export class Navbarcomponent {
  menuAbierto: boolean = false;
  menuMoneda: boolean = false;
  menuCuenta: boolean = false;

  constructor(
    private router: Router,
    public monedaService: MonedaService,
    public sesionService: SesionService,
  ) {}

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

  alternarMenuCuenta(): void {
    this.menuCuenta = !this.menuCuenta;
  }

  cerrarMenuCuenta(): void {
    this.menuCuenta = false;
  }

  cerrarSesion(): void {
    this.sesionService.cerrarSesion();
    this.menuCuenta = false;
    this.cerrarMenu();
    void this.router.navigate(['/inicio']);
  }
}
