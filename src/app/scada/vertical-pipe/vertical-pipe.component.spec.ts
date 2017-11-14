import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalPipeComponent } from './vertical-pipe.component';

describe('VerticalPipeComponent', () => {
  let component: VerticalPipeComponent;
  let fixture: ComponentFixture<VerticalPipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalPipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
