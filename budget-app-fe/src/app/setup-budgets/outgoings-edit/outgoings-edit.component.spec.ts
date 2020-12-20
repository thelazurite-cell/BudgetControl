import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutgoingsEditComponent } from './outgoings-edit.component';

describe('OutgoingsEditComponent', () => {
  let component: OutgoingsEditComponent;
  let fixture: ComponentFixture<OutgoingsEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
