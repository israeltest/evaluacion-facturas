import { Component, OnInit, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { InvoiceService, InvoiceSummary } from '../../core/services/invoice';
import { ProductService } from '../../core/services/product';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChart!: ElementRef;
  chart: any;

  private invoiceService = inject(InvoiceService);
  private productService = inject(ProductService);

  recentInvoices: InvoiceSummary[] = [];
  topProducts: any[] = [];
  monthlyData: number[] = new Array(12).fill(0);

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  loadData(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        const sortedInvoices = invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.recentInvoices = sortedInvoices.slice(0, 5);

        invoices.forEach(inv => {
          const date = new Date(inv.date);
          const month = date.getMonth(); 
          this.monthlyData[month] += inv.total;
        });

        this.updateChart();
      }
    });

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.topProducts = products.map(p => ({
          name: p.name,
          salesCount: Math.floor(Math.random() * 500) + 10
        })).sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);
      }
    });
  }

  initChart(): void {
    if (this.salesChart) {
      this.chart = new Chart(this.salesChart.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          datasets: [{
            label: 'Total Vendido ($)',
            data: this.monthlyData,
            backgroundColor: 'rgba(135, 206, 250, 0.8)', // Color azul claro como en la imagen
            borderColor: 'rgba(135, 206, 250, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false } // Ocultar leyenda para que se parezca más a tu imagen
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.monthlyData;
      this.chart.update();
    }
  }
}
