import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobadoC } from './aprobado-c';

describe('AprobadoC', () => {
  let component: AprobadoC;
  let fixture: ComponentFixture<AprobadoC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprobadoC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprobadoC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
