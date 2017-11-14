import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeEndTopComponent } from './pipe-end-top.component';

describe('PipeEndTopComponent', () => {
  let component: PipeEndTopComponent;
  let fixture: ComponentFixture<PipeEndTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeEndTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeEndTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
