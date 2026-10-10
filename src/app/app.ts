import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MonedaService } from './services/moneda.service';

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  constructor(
    private monedaService: MonedaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.monedaService.cargarTasas().subscribe(() => {
      this.cdr.detectChanges();
    });
  }
}
