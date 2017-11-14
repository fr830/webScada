import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTwayComponent } from './top-tway.component';

describe('TopTwayComponent', () => {
  let component: TopTwayComponent;
  let fixture: ComponentFixture<TopTwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopTwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
