import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService, Product } from '../../../../core/services/product';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatInputModule, MatFormFieldModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['code', 'name', 'price', 'status', 'added', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.dataSource.data = data.map(prod => ({
        ...prod,
        isActive: prod.isActive !== false
      })),
      error: () => this.showError('Error al cargar productos')
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ProductForm, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadProducts();
    });
  }

  openEditDialog(product: Product) {
    const dialogRef = this.dialog.open(ProductForm, { width: '500px', data: product });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadProducts();
    });
  }

  deleteProduct(id: number) {
    if (confirm('¿Seguro que deseas desactivar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Producto desactivado', 'Cerrar', { duration: 3000 });
          this.loadProducts();
        },
        error: () => this.showError('Error al desactivar el producto')
      });
    }
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
