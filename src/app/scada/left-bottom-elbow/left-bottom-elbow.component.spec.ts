import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftBottomElbowComponent } from './left-bottom-elbow.component';

describe('LeftBottomElbowComponent', () => {
  let component: LeftBottomElbowComponent;
  let fixture: ComponentFixture<LeftBottomElbowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftBottomElbowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftBottomElbowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
