import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOutgoingDialogComponent } from './add-outgoing-dialog.component';

describe('AddOutgoingDialogComponent', () => {
  let component: AddOutgoingDialogComponent;
  let fixture: ComponentFixture<AddOutgoingDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOutgoingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutgoingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
