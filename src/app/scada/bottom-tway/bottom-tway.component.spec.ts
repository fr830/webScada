import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomTwayComponent } from './bottom-tway.component';

describe('BottomTwayComponent', () => {
  let component: BottomTwayComponent;
  let fixture: ComponentFixture<BottomTwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomTwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomTwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
