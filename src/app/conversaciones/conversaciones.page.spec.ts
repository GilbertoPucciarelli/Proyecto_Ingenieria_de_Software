import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversacionesPage } from './conversaciones.page';

describe('ConversacionesPage', () => {
  let component: ConversacionesPage;
  let fixture: ComponentFixture<ConversacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversacionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
