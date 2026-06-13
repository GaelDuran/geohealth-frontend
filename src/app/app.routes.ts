import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Specialties } from './pages/specialties/specialties';
import { MedicalStaff } from './pages/medical-staff/medical-staff';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'specialties',
    component: Specialties
  },
  {
    path: 'medical-staff',
    component: MedicalStaff
  }
];
