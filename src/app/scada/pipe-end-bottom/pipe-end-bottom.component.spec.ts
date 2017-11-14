import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeEndBottomComponent } from './pipe-end-bottom.component';

describe('PipeEndBottomComponent', () => {
  let component: PipeEndBottomComponent;
  let fixture: ComponentFixture<PipeEndBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeEndBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeEndBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
