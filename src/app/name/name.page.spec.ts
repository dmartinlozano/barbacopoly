import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NamePage } from './name.page';

describe('NamePage', () => {
  let component: NamePage;
  let fixture: ComponentFixture<NamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
