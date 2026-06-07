import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'configuracion', loadComponent: () => import('./features/company/config/config').then(m => m.ConfigComponent) },
      { path: 'clientes', loadComponent: () => import('./features/catalogs/clients/client-list/client-list').then(m => m.ClientList) },
      { path: 'productos', loadComponent: () => import('./features/catalogs/products/product-list/product-list').then(m => m.ProductList) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
