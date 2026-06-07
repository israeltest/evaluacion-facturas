import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InvoiceService } from '../../../core/services/invoice';
import { ClientService } from '../../../core/services/client';
import { ProductService } from '../../../core/services/product';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './invoice-create.html',
  styleUrl: './invoice-create.css'
})
export class InvoiceCreate implements OnInit {
  private fb = inject(FormBuilder);
  private invoiceService = inject(InvoiceService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  invoiceForm!: FormGroup;
  clients: any[] = [];
  products: any[] = [];
  isEditMode = false;
  invoiceId!: number;

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.setupCalculations();

    const route = inject(ActivatedRoute);
    const idParam = route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.invoiceId = +idParam;
      this.loadInvoiceData(this.invoiceId);
    }
  }

  initForm(): void {
    this.invoiceForm = this.fb.group({
      clientId: ['', Validators.required],
      paymentMethod: ['Efectivo', Validators.required],
      subtotal: [{ value: 0, disabled: true }],
      tax: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
      details: this.fb.array([], Validators.required)
    });
    // Se añade la primera fila por defecto
    this.addDetail();
  }

  loadData(): void {
    this.clientService.getClients().subscribe(res => this.clients = res);
    this.productService.getProducts().subscribe(res => this.products = res);
  }

  loadInvoiceData(id: number): void {
    this.invoiceService.getInvoice(id).subscribe({
      next: (invoice) => {
        this.invoiceForm.patchValue({
          clientId: invoice.clientId,
          paymentMethod: invoice.paymentMethod
        });
        
        // Limpiar primer detalle vacio
        this.details.clear();

        // Cargar detalles
        if (invoice.details && invoice.details.length > 0) {
          invoice.details.forEach((d: any) => {
            const detailForm = this.fb.group({
              productId: [d.productId],
              productCode: [d.productCode, Validators.required],
              description: [d.description, Validators.required],
              quantity: [d.quantity, [Validators.required, Validators.min(1)]],
              unitPrice: [d.unitPrice, [Validators.required, Validators.min(0.01)]],
              totalPrice: [{ value: d.totalPrice, disabled: true }]
            });
            this.details.push(detailForm);
          });
        }
        this.calculateTotals();
      },
      error: (err) => {
        console.error('Error al cargar factura para edición', err);
        this.snackBar.open('Error al cargar factura', 'Cerrar', { duration: 3000 });
      }
    });
  }

  get details(): FormArray {
    return this.invoiceForm.get('details') as FormArray;
  }

  addDetail(): void {
    const detailForm = this.fb.group({
      productId: [''], // Puede ir vacío si es un ingreso manual
      productCode: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      totalPrice: [{ value: 0, disabled: true }]
    });

    this.details.push(detailForm);
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
    this.calculateTotals();
  }

  onProductSelect(index: number, productId: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      const detail = this.details.at(index);
      detail.patchValue({
        productCode: product.code,
        description: product.name,
        unitPrice: product.price
      });
      this.calculateRowTotal(index);
    }
  }

  setupCalculations(): void {
    this.details.valueChanges.subscribe(() => {
      // Recalcular todas las filas cuando cambia algún valor (como cantidad o precio)
      for (let i = 0; i < this.details.length; i++) {
        this.calculateRowTotal(i, false);
      }
      this.calculateTotals();
    });
  }

  calculateRowTotal(index: number, triggerGlobal: boolean = true): void {
    const detail = this.details.at(index);
    const qty = detail.get('quantity')?.value || 0;
    const price = detail.get('unitPrice')?.value || 0;
    const total = qty * price;
    
    // Se actualiza el campo readonly sin disparar el valueChanges de nuevo para evitar un ciclo infinito
    detail.get('totalPrice')?.setValue(total, { emitEvent: false });
    
    if (triggerGlobal) {
      this.calculateTotals();
    }
  }

  calculateTotals(): void {
    let subtotal = 0;
    for (let i = 0; i < this.details.length; i++) {
      const rowTotal = this.details.at(i).get('totalPrice')?.value || 0;
      subtotal += rowTotal;
    }

    const tax = subtotal * 0.13; // 13% IVA
    const total = subtotal + tax;

    this.invoiceForm.patchValue({
      subtotal: subtotal,
      tax: tax,
      total: total
    }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const rawData = this.invoiceForm.getRawValue();
      
      if (this.isEditMode) {
        this.invoiceService.updateInvoice(this.invoiceId, rawData).subscribe({
          next: () => {
            this.snackBar.open('Factura actualizada exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/facturas']);
          },
          error: (err) => {
            console.error('Error al actualizar factura', err);
            this.snackBar.open('Error al actualizar factura', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        this.invoiceService.createInvoice(rawData).subscribe({
          next: (invoice) => {
            this.snackBar.open('Factura creada exitosamente', 'Cerrar', { duration: 3000 });
            // Ir directo a la pantalla de impresión
            this.router.navigate(['/facturas/imprimir', invoice.id]);
          },
          error: (err) => {
            console.error('Error al crear factura', err);
            this.snackBar.open('Error al crear factura', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/facturas']);
  }
}
