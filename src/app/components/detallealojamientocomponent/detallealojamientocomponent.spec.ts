import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detallealojamientocomponent } from './detallealojamientocomponent';

describe('Detallealojamientocomponent', () => {
  let component: Detallealojamientocomponent;
  let fixture: ComponentFixture<Detallealojamientocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detallealojamientocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Detallealojamientocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
