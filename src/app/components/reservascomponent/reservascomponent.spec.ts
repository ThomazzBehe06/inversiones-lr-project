import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Reservascomponent } from './reservascomponent';

describe('Reservascomponent', () => {
  let component: Reservascomponent;
  let fixture: ComponentFixture<Reservascomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reservascomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Reservascomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
