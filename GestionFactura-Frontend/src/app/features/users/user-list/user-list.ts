import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService, User } from '../../../core/services/user';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatInputModule, MatFormFieldModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'nombres', 'username', 'email', 'added', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => this.dataSource.data = data,
      error: () => this.showError('Error al cargar usuarios')
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(UserForm, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  openEditDialog(user: User) {
    const dialogRef = this.dialog.open(UserForm, { width: '500px', data: user });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  deleteUser(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
          this.loadUsers();
        },
        error: () => this.showError('Error al eliminar el usuario')
      });
    }
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
