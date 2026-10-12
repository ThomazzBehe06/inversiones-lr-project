import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Climacomponent } from './climacomponent';

describe('Climacomponent', () => {
  let component: Climacomponent;
  let fixture: ComponentFixture<Climacomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Climacomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Climacomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
