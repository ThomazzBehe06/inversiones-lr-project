import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mapaubicacioncomponent } from './mapaubicacioncomponent';

describe('Mapaubicacioncomponent', () => {
  let component: Mapaubicacioncomponent;
  let fixture: ComponentFixture<Mapaubicacioncomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mapaubicacioncomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Mapaubicacioncomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
