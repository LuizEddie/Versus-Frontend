import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinConditionSelectComponent } from './win-condition-select.component';

describe('WinConditionSelectComponent', () => {
  let component: WinConditionSelectComponent;
  let fixture: ComponentFixture<WinConditionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinConditionSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinConditionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
