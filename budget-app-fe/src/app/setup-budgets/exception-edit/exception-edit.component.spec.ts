import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExceptionEditComponent } from './exception-edit.component';

describe('ExceptionEditComponent', () => {
  let component: ExceptionEditComponent;
  let fixture: ComponentFixture<ExceptionEditComponent>;

  beforeEach(waitForAsync(() => {
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
