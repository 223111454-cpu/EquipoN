import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobadoP } from './aprobado-p';

describe('AprobadoP', () => {
  let component: AprobadoP;
  let fixture: ComponentFixture<AprobadoP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprobadoP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprobadoP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
