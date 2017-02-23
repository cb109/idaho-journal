/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WriteComponent } from './write.component';

describe('WriteComponent', () => {
  let component: WriteComponent;
  let fixture: ComponentFixture<WriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
