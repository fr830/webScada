import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightTopElbowComponent } from './right-top-elbow.component';

describe('RightTopElbowComponent', () => {
  let component: RightTopElbowComponent;
  let fixture: ComponentFixture<RightTopElbowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightTopElbowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightTopElbowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
