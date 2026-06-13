import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalStaff } from './medical-staff';

describe('MedicalStaff', () => {
  let component: MedicalStaff;
  let fixture: ComponentFixture<MedicalStaff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalStaff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalStaff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
