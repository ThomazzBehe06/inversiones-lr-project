import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbarcomponent } from './components/navbarcomponent/navbarcomponent';
import { Footercomponent } from './components/footercomponent/footercomponent';
import { MonedaService } from './services/moneda.service';

@Component({
  imports: [RouterOutlet, Navbarcomponent, Footercomponent],
  selector: 'app-root',
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
