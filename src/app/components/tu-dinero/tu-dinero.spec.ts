import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuDinero } from './tu-dinero';

describe('TuDinero', () => {
  let component: TuDinero;
  let fixture: ComponentFixture<TuDinero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuDinero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuDinero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
