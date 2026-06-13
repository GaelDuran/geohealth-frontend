import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Specialties } from './specialties';

describe('Specialties', () => {
  let component: Specialties;
  let fixture: ComponentFixture<Specialties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Specialties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Specialties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
