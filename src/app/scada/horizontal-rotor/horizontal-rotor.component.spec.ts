import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalRotorComponent } from './horizontal-rotor.component';

describe('HorizontalRotorComponent', () => {
  let component: HorizontalRotorComponent;
  let fixture: ComponentFixture<HorizontalRotorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalRotorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalRotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
