import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFlowComponent } from './model-flow.component';

describe('ModelFlowComponent', () => {
  let component: ModelFlowComponent;
  let fixture: ComponentFixture<ModelFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
