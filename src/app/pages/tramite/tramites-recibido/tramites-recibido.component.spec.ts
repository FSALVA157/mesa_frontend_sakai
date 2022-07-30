import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesRecibidoComponent } from './tramites-recibido.component';

describe('TramitesRecibidoComponent', () => {
  let component: TramitesRecibidoComponent;
  let fixture: ComponentFixture<TramitesRecibidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesRecibidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesRecibidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
