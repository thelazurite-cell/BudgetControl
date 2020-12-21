import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddExceptionDialogComponent } from './add-exception-dialog.component';

describe('AddExceptionDialogComponent', () => {
  let component: AddExceptionDialogComponent;
  let fixture: ComponentFixture<AddExceptionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExceptionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExceptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
