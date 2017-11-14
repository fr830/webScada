import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalRotorComponent } from './vertical-rotor.component';

describe('VerticalRotorComponent', () => {
  let component: VerticalRotorComponent;
  let fixture: ComponentFixture<VerticalRotorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalRotorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalRotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
