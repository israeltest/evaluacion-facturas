import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyConfigService } from '../../../core/services/company-config';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './config.html',
  styleUrl: './config.css'
})
export class ConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private configService = inject(CompanyConfigService);
  private snackBar = inject(MatSnackBar);

  configForm: FormGroup;
  isLoading = true;
  isSaving = false;

  constructor() {
    this.configForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', Validators.maxLength(20)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      taxPercentage: [13, [Validators.required, Validators.min(0), Validators.max(100)]],
      currencySymbol: ['$', [Validators.required, Validators.maxLength(5)]],
      address: ['', Validators.maxLength(200)],
      city: ['', Validators.maxLength(100)],
      region: ['', Validators.maxLength(100)],
      postalCode: ['', Validators.maxLength(20)]
    });
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.isLoading = true;
    this.configService.getConfig().subscribe({
      next: (data) => {
        if (data) {
          this.configForm.patchValue(data);
        }
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar la configuración', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.configForm.valid) {
      this.isSaving = true;
      this.configService.updateConfig(this.configForm.value).subscribe({
        next: () => {
          this.snackBar.open('Configuración guardada exitosamente', 'Cerrar', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.isSaving = false;
        },
        error: () => {
          this.snackBar.open('Error al guardar la configuración', 'Cerrar', { duration: 3000 });
          this.isSaving = false;
        }
      });
    } else {
      this.configForm.markAllAsTouched();
    }
  }
}
