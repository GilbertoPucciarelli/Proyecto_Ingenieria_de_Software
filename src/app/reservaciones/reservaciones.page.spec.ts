import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionesPage } from './reservaciones.page';

describe('ReservacionesPage', () => {
  let component: ReservacionesPage;
  let fixture: ComponentFixture<ReservacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservacionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
