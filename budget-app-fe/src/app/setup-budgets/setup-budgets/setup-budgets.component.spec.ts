import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetupBudgetsComponent } from './setup-budgets.component';

describe('SetupBudgetsComponent', () => {
  let component: SetupBudgetsComponent;
  let fixture: ComponentFixture<SetupBudgetsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupBudgetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
