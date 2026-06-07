import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { InvoiceService, InvoiceSummary } from '../../../core/services/invoice';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule
  ],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css'
})
export class InvoiceList implements OnInit {
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);
  
  displayedColumns: string[] = ['invoiceNumber', 'date', 'clientName', 'total', 'status', 'actions'];
  dataSource = new MatTableDataSource<InvoiceSummary>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Error al cargar facturas', err)
    });
  }

  createNew(): void {
    this.router.navigate(['/facturas/nueva']);
  }

  deleteInvoice(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta factura?')) {
      this.invoiceService.deleteInvoice(id).subscribe({
        next: () => {
          this.loadInvoices();
        },
        error: (err) => {
          console.error('Error al eliminar factura', err);
          alert('Error al eliminar factura');
        }
      });
    }
  }
}
