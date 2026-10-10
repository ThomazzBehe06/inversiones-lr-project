import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alojamientoscomponent } from './alojamientoscomponent';

describe('Alojamientoscomponent', () => {
  let component: Alojamientoscomponent;
  let fixture: ComponentFixture<Alojamientoscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alojamientoscomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Alojamientoscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
