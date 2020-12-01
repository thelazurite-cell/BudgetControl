import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingsEditComponent } from './outgoings-edit.component';

describe('OutgoingsEditComponent', () => {
  let component: OutgoingsEditComponent;
  let fixture: ComponentFixture<OutgoingsEditComponent>;

  beforeEach(async(() => {
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
