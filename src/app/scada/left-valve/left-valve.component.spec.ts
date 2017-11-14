import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftValveComponent } from './left-valve.component';

describe('LeftValveComponent', () => {
  let component: LeftValveComponent;
  let fixture: ComponentFixture<LeftValveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftValveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftValveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
