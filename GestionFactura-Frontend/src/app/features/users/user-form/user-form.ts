import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService, User } from '../../../core/services/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  constructor(
    public dialogRef: MatDialogRef<UserForm>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.isEditMode = !!data;
    this.userForm = this.fb.group({
      nombres: [data?.nombres || '', Validators.required],
      apellidos: [data?.apellidos || ''],
      username: [data?.username || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      passwordHash: [''] // No se requiere si está en modo edición
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;
    const userData: User = {
      ...formValue
    };

    if (this.isEditMode && this.data?.id) {
      this.userService.updateUser(this.data.id, userData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err)
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
