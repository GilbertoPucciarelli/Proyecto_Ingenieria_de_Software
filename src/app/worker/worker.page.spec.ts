import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerPage } from './worker.page';

describe('WorkerPage', () => {
  let component: WorkerPage;
  let fixture: ComponentFixture<WorkerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
