import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopElbowComponent } from './top-elbow.component';

describe('TopElbowComponent', () => {
  let component: TopElbowComponent;
  let fixture: ComponentFixture<TopElbowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopElbowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopElbowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
