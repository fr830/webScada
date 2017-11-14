import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeEndLeftComponent } from './pipe-end-left.component';

describe('PipeEndLeftComponent', () => {
  let component: PipeEndLeftComponent;
  let fixture: ComponentFixture<PipeEndLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeEndLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeEndLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
