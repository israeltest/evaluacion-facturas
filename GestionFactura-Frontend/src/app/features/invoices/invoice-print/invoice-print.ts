import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice';
import { CompanyConfigService, CompanyConfig } from '../../../core/services/company-config';

@Component({
  selector: 'app-invoice-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-print.html',
  styleUrl: './invoice-print.css'
})
export class InvoicePrint implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);
  private configService = inject(CompanyConfigService);

  invoice: any;
  companyConfig: CompanyConfig | null = null;
  loading = true;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const invoiceId = Number(idParam);
      this.loadData(invoiceId);
    } else {
      this.router.navigate(['/facturas']);
    }
  }

  loadData(invoiceId: number): void {
    // Cargar la configuración primero
    this.configService.getConfig().subscribe({
      next: (config) => {
        this.companyConfig = config;
        // Luego cargar la factura
        this.invoiceService.getInvoice(invoiceId).subscribe({
          next: (inv) => {
            this.invoice = inv;
            this.loading = false;
            // Retrasar la impresión para permitir que Angular renderice la vista
            setTimeout(() => {
              window.print();
            }, 500);
          },
          error: (err) => {
            console.error('Error al cargar factura', err);
            this.router.navigate(['/facturas']);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar configuración de empresa', err);
        this.router.navigate(['/facturas']);
      }
    });
  }

  printNow(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/facturas']);
  }
}
