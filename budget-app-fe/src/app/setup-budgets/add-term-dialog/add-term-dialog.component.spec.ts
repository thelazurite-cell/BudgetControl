import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTermDialogComponent } from './add-term-dialog.component';

describe('AddTermDialogComponent', () => {
  let component: AddTermDialogComponent;
  let fixture: ComponentFixture<AddTermDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTermDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTermDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
