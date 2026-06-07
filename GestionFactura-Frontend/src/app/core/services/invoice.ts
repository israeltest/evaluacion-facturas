import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InvoiceDetail {
  productId?: number;
  productCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceCreate {
  clientId: number;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  total: number;
  details: InvoiceDetail[];
}

export interface InvoiceSummary {
  id: number;
  invoiceNumber: string;
  date: string;
  clientName: string;
  status: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/invoices`;

  getInvoices(): Observable<InvoiceSummary[]> {
    return this.http.get<InvoiceSummary[]>(this.apiUrl);
  }

  getInvoice(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoice: InvoiceCreate): Observable<any> {
    return this.http.post<any>(this.apiUrl, invoice);
  }

  updateInvoice(id: number, invoice: InvoiceCreate): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
