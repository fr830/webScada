import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopValveComponent } from './top-valve.component';

describe('TopValveComponent', () => {
  let component: TopValveComponent;
  let fixture: ComponentFixture<TopValveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopValveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopValveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
