import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PayOutgoingComponent } from './pay-outgoing.component';

describe('PayOutgoingComponent', () => {
  let component: PayOutgoingComponent;
  let fixture: ComponentFixture<PayOutgoingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PayOutgoingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
