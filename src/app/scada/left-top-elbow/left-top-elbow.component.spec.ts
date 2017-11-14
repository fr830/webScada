import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftTopElbowComponent } from './left-top-elbow.component';

describe('LeftTopElbowComponent', () => {
  let component: LeftTopElbowComponent;
  let fixture: ComponentFixture<LeftTopElbowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftTopElbowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftTopElbowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
