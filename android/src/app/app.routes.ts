import { Routes } from '@angular/router';
import { LocationTrackerComponent } from './components/location-tracker/location-tracker';
import { LocationListPageComponent } from './components/location-list-page/location-list-page.component';
import { DemoComponent } from './components/demo/demo.component';

export const routes: Routes = [
  { path: 'demo', component: DemoComponent },
  { 
    path: 'tracker', 
    component: LocationTrackerComponent
  },
  { 
    path: 'list', 
    component: LocationListPageComponent
  },
  { 
    path: '', 
    component: LocationListPageComponent
  },
  { 
    path: '**', 
    redirectTo: '/list'
  }
];
