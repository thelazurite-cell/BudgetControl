import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpendituresComponent } from './expenditures.component';

describe('ExpendituresComponent', () => {
  let component: ExpendituresComponent;
  let fixture: ComponentFixture<ExpendituresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpendituresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpendituresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
