import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';


@Component({
  selector: 'app-medical-staff',
  standalone: true,
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './medical-staff.html',
  styleUrl: './medical-staff.css'
})
export class MedicalStaff implements OnInit {

  API_BASE = 'http://localhost:4000';

  doctors: any[] = [];
  specialties: any[] = [];

  name = '';
  phone = '';
  specialty = '';

  editingId: string | null = null;

  ngOnInit() {
    this.loadDoctors();
    this.loadSpecialties();
  }

  async loadDoctors() {

    const res = await fetch(
      `${this.API_BASE}/api/medicalStaff`
    );

    this.doctors = await res.json();
  }

  async loadSpecialties() {

    const res = await fetch(
      `${this.API_BASE}/api/specialties`
    );

    this.specialties = await res.json();
  }

  async saveDoctor() {

    const url = this.editingId
      ? `${this.API_BASE}/api/medicalStaff/${this.editingId}`
      : `${this.API_BASE}/api/medicalStaff`;

    const method = this.editingId ? 'PATCH' : 'POST';

    await fetch(url, {

      method,
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        name: this.name,
        phone: this.phone,
        specialty: this.specialty
      })

    });

    this.name = '';
    this.phone = '';
    this.specialty = '';
    this.editingId = null;

    this.loadDoctors();
  }

  editDoctor(d: any) {

    this.name = d.name;
    this.phone = d.phone;
    this.specialty = d.specialty?._id || d.specialty;
    this.editingId = d._id;

  }

  async deleteDoctor(id: string) {

    await fetch(
      `${this.API_BASE}/api/medicalStaff/${id}`,
      { method: 'DELETE' }
    );

    this.loadDoctors();
  }

}
