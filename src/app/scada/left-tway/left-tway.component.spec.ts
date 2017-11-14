import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftTwayComponent } from './left-tway.component';

describe('LeftTwayComponent', () => {
  let component: LeftTwayComponent;
  let fixture: ComponentFixture<LeftTwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftTwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftTwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
