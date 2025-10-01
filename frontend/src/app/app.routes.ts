import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthSuccessComponent } from './components/auth-success/auth-success.component';
import { LocationTrackerComponent } from './components/location-tracker/location-tracker';
import { LocationListPageComponent } from './components/location-list-page/location-list-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth-success', component: AuthSuccessComponent },
  { 
    path: 'tracker', 
    component: LocationTrackerComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'list', 
    component: LocationListPageComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '', 
    component: LocationListPageComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    redirectTo: '/list'
  }
];
