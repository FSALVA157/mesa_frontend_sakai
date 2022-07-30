import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesEnviadoComponent } from './tramites-enviado.component';

describe('TramitesEnviadoComponent', () => {
  let component: TramitesEnviadoComponent;
  let fixture: ComponentFixture<TramitesEnviadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesEnviadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesEnviadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
