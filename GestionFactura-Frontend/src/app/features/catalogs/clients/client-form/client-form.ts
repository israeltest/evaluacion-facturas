import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ClientService, Client } from '../../../../core/services/client';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm implements OnInit {
  clientForm: FormGroup;
  isEditMode = false;
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);

  constructor(
    public dialogRef: MatDialogRef<ClientForm>,
    @Inject(MAT_DIALOG_DATA) public data: Client | null
  ) {
    this.isEditMode = !!data;
    this.clientForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.maxLength(100)]],
      phone: [data?.phone || '', Validators.maxLength(20)],
      email: [data?.email || '', [Validators.email, Validators.maxLength(100)]],
      address: [data?.address || '', Validators.maxLength(200)],
      isActive: [data?.isActive !== false]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.clientForm.invalid) return;

    const formValue = this.clientForm.value;
    const clientData: Client = {
      ...formValue
    };

    if (this.isEditMode && this.data?.id) {
      this.clientService.updateClient(this.data.id, clientData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err)
      });
    } else {
      this.clientService.createClient(clientData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
