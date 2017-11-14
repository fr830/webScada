import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightTwayComponent } from './right-tway.component';

describe('RightTwayComponent', () => {
  let component: RightTwayComponent;
  let fixture: ComponentFixture<RightTwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightTwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightTwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
