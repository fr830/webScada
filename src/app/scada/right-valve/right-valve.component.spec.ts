import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightValveComponent } from './right-valve.component';

describe('RightValveComponent', () => {
  let component: RightValveComponent;
  let fixture: ComponentFixture<RightValveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightValveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightValveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
