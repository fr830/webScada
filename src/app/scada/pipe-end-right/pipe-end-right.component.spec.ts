import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeEndRightComponent } from './pipe-end-right.component';

describe('PipeEndRightComponent', () => {
  let component: PipeEndRightComponent;
  let fixture: ComponentFixture<PipeEndRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeEndRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeEndRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
