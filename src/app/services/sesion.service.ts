import { Injectable, signal } from '@angular/core';
import { Usuario } from '../models/usuario';

const SIN_USUARIO: Usuario = { nombre: '', correo: '', contrasena: '' };

@Injectable({ providedIn: 'root' })
export class SesionService {
  private claveUsuarios: string = 'usuariosRegistrados';
  private claveSesion: string = 'usuarioActual';

  logueado = signal<boolean>(false);
  usuarioActual = signal<Usuario>(SIN_USUARIO);

  private usuariosRegistrados: Usuario[] = this.cargarUsuarios();

  constructor() {
    const datos = localStorage.getItem(this.claveSesion);

    if (datos) {
      this.usuarioActual.set(JSON.parse(datos));
      this.logueado.set(true);
    }
  }

  buscarPorCorreo(correo: string): Usuario | undefined {
    return this.usuariosRegistrados.find(
      (usuario) => usuario.correo.toLowerCase() === correo.toLowerCase(),
    );
  }

  registrarUsuario(usuario: Usuario): void {
    this.usuariosRegistrados.push(usuario);
    localStorage.setItem(this.claveUsuarios, JSON.stringify(this.usuariosRegistrados));
  }

  iniciarSesion(usuario: Usuario): void {
    this.usuarioActual.set(usuario);
    this.logueado.set(true);
    localStorage.setItem(this.claveSesion, JSON.stringify(usuario));
  }

  cerrarSesion(): void {
    this.usuarioActual.set(SIN_USUARIO);
    this.logueado.set(false);
    localStorage.removeItem(this.claveSesion);
  }

  private cargarUsuarios(): Usuario[] {
    try {
      const datos = localStorage.getItem(this.claveUsuarios);
      return datos ? (JSON.parse(datos) as Usuario[]) : [];
    } catch {
      return [];
    }
  }
}
