import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalTankComponent } from './horizontal-tank.component';

describe('HorizontalTankComponent', () => {
  let component: HorizontalTankComponent;
  let fixture: ComponentFixture<HorizontalTankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalTankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
