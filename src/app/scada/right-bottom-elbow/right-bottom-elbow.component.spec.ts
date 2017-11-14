import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightBottomElbowComponent } from './right-bottom-elbow.component';

describe('RightBottomElbowComponent', () => {
  let component: RightBottomElbowComponent;
  let fixture: ComponentFixture<RightBottomElbowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightBottomElbowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightBottomElbowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
