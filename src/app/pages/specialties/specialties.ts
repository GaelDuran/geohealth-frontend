import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-specialties',
  standalone: true,
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './specialties.html',
  styleUrl: './specialties.css'
})
export class Specialties implements OnInit {

  API_BASE = 'https://geohealth-backend-a2i9.onrender.com';

  specialties: any[] = [];

  name = '';
  description = '';

  editingId: string | null = null;

  ngOnInit() {
    this.loadSpecialties();
  }

  async loadSpecialties() {

    const res = await fetch(
      `${this.API_BASE}/api/specialties`
    );

    this.specialties = await res.json();
  }

  async saveSpecialty() {

    const url = this.editingId
      ? `${this.API_BASE}/api/specialties/${this.editingId}`
      : `${this.API_BASE}/api/specialties`;

    const method = this.editingId ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.name,
        description: this.description
      })
    });

    this.name = '';
    this.description = '';
    this.editingId = null;

    this.loadSpecialties();
  }

  editSpecialty(s: any) {
    this.name = s.name;
    this.description = s.description;
    this.editingId = s._id;
  }

  async deleteSpecialty(id: string) {
    await fetch(
      `${this.API_BASE}/api/specialties/${id}`,
      { method: 'DELETE' }
    );

    this.loadSpecialties();
  }

}
