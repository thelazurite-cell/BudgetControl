import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupBudgetsComponent } from './setup-budgets.component';

describe('SetupBudgetsComponent', () => {
  let component: SetupBudgetsComponent;
  let fixture: ComponentFixture<SetupBudgetsComponent>;

  beforeEach(async(() => {
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
