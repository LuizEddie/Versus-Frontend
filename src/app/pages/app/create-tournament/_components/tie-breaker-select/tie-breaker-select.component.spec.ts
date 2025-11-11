import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieBreakerSelectComponent } from './tie-breaker-select.component';

describe('TieBreakerSelectComponent', () => {
  let component: TieBreakerSelectComponent;
  let fixture: ComponentFixture<TieBreakerSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TieBreakerSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieBreakerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
