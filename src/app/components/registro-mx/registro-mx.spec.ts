import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMX } from './registro-mx';

describe('RegistroMX', () => {
  let component: RegistroMX;
  let fixture: ComponentFixture<RegistroMX>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroMX]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMX);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
