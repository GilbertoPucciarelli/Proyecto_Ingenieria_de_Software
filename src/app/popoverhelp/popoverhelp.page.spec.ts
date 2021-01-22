import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverhelpPage } from './popoverhelp.page';

describe('PopoverhelpPage', () => {
  let component: PopoverhelpPage;
  let fixture: ComponentFixture<PopoverhelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverhelpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverhelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
