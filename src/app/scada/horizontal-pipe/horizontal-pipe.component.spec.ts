import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalPipeComponent } from './horizontal-pipe.component';

describe('HorizontalPipeComponent', () => {
  let component: HorizontalPipeComponent;
  let fixture: ComponentFixture<HorizontalPipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalPipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
