import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SesionService } from '../../services/sesion.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-logincomponent',
  standalone: false,
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class Logincomponent {
  vista: 'entrar' | 'registro' = 'entrar';
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  mensajeError: string = '';

  constructor(
    private sesionService: SesionService,
    private router: Router,
    private ruta: ActivatedRoute,
  ) {}

  cambiarVista(vista: 'entrar' | 'registro'): void {
    this.vista = vista;
    this.mensajeError = '';
  }

  iniciarSesion(): void {
    const usuario = this.sesionService.buscarPorCorreo(this.correo.trim());

    if (!usuario || usuario.contrasena !== this.contrasena) {
      this.mensajeError = 'Correo o contraseña incorrectos.';
      return;
    }

    this.entrar(usuario);
  }

  crearCuenta(): void {
    const nombre = this.nombre.trim();
    const correo = this.correo.trim();

    if (nombre === '' || correo === '') {
      this.mensajeError = 'Completa tu nombre y tu correo electrónico.';
      return;
    }

    if (this.contrasena.length < 6) {
      this.mensajeError = 'Tu contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.sesionService.buscarPorCorreo(correo)) {
      this.mensajeError = 'Ya existe una cuenta con ese correo electrónico.';
      return;
    }

    const nuevoUsuario: Usuario = { nombre, correo, contrasena: this.contrasena };
    this.sesionService.registrarUsuario(nuevoUsuario);
    this.entrar(nuevoUsuario);
  }

  private entrar(usuario: Usuario): void {
    this.sesionService.iniciarSesion(usuario);
    const volver = this.ruta.snapshot.queryParamMap.get('volver');
    void this.router.navigateByUrl(volver || '/inicio');
  }
}
