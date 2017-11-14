import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosspipeComponent } from './crosspipe.component';

describe('CrosspipeComponent', () => {
  let component: CrosspipeComponent;
  let fixture: ComponentFixture<CrosspipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosspipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosspipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
