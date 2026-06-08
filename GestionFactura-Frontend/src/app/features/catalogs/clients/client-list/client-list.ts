import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClientService, Client } from '../../../../core/services/client';
import { ClientForm } from '../client-form/client-form';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatInputModule, MatFormFieldModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'phone', 'email', 'status', 'added', 'actions'];
  dataSource = new MatTableDataSource<Client>([]);

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (data) => this.dataSource.data = data.map(client => ({
        ...client,
        isActive: client.isActive !== false
      })),
      error: () => this.showError('Error al cargar clientes')
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ClientForm, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadClients();
    });
  }

  openEditDialog(client: Client) {
    const dialogRef = this.dialog.open(ClientForm, { width: '500px', data: client });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadClients();
    });
  }

  deleteClient(id: number) {
    if (confirm('¿Seguro que deseas desactivar este cliente?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.snackBar.open('Cliente desactivado', 'Cerrar', { duration: 3000 });
          this.loadClients();
        },
        error: () => this.showError('Error al desactivar el cliente')
      });
    }
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
