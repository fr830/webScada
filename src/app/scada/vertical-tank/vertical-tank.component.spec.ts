import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalTankComponent } from './vertical-tank.component';

describe('VerticalTankComponent', () => {
  let component: VerticalTankComponent;
  let fixture: ComponentFixture<VerticalTankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalTankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
