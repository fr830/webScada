import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomValveComponent } from './bottom-valve.component';

describe('BottomValveComponent', () => {
  let component: BottomValveComponent;
  let fixture: ComponentFixture<BottomValveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomValveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomValveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
