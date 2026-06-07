import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductService, Product } from '../../../../core/services/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  constructor(
    public dialogRef: MatDialogRef<ProductForm>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.isEditMode = !!data;
    this.productForm = this.fb.group({
      code: [data?.code || '', [Validators.required, Validators.maxLength(50)]],
      name: [data?.name || '', [Validators.required, Validators.maxLength(100)]],
      price: [data?.price || '', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;
    const productData: Product = {
      ...formValue,
      isActive: true
    };

    if (this.isEditMode && this.data?.id) {
      this.productService.updateProduct(this.data.id, productData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err)
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
