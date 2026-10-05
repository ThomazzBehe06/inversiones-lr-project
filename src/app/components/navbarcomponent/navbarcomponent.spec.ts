import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Navbarcomponent } from './navbarcomponent';

describe('Navbarcomponent', () => {
  let component: Navbarcomponent;
  let fixture: ComponentFixture<Navbarcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbarcomponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbarcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
