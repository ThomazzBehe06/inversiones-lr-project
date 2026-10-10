import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Iniciocomponent } from './iniciocomponent';

describe('Iniciocomponent', () => {
  let component: Iniciocomponent;
  let fixture: ComponentFixture<Iniciocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Iniciocomponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Iniciocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
