import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEX } from './registro-ex';

describe('RegistroEX', () => {
  let component: RegistroEX;
  let fixture: ComponentFixture<RegistroEX>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroEX]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEX);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
