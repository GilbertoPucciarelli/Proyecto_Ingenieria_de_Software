import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverreservaPage } from './popoverreserva.page';

describe('PopoverreservaPage', () => {
  let component: PopoverreservaPage;
  let fixture: ComponentFixture<PopoverreservaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverreservaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverreservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
