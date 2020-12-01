import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionEditComponent } from './exception-edit.component';

describe('ExceptionEditComponent', () => {
  let component: ExceptionEditComponent;
  let fixture: ComponentFixture<ExceptionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceptionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
