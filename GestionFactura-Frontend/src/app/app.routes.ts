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
      { path: 'usuarios', loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserList) },
      { path: 'clientes', loadComponent: () => import('./features/catalogs/clients/client-list/client-list').then(m => m.ClientList) },
      { path: 'productos', loadComponent: () => import('./features/catalogs/products/product-list/product-list').then(m => m.ProductList) },
      { path: 'facturas', loadComponent: () => import('./features/invoices/invoice-list/invoice-list').then(m => m.InvoiceList) },
      { path: 'facturas/nueva', loadComponent: () => import('./features/invoices/invoice-create/invoice-create').then(m => m.InvoiceCreate) },
      { path: 'facturas/editar/:id', loadComponent: () => import('./features/invoices/invoice-create/invoice-create').then(m => m.InvoiceCreate) },
      { path: 'facturas/imprimir/:id', loadComponent: () => import('./features/invoices/invoice-print/invoice-print').then(m => m.InvoicePrint) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
