import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesPendienteComponent } from './tramites-pendiente.component';

describe('TramitesPendienteComponent', () => {
  let component: TramitesPendienteComponent;
  let fixture: ComponentFixture<TramitesPendienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesPendienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
