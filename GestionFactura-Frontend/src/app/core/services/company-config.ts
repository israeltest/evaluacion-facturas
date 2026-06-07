import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompanyConfig {
  companyName: string;
  phone: string;
  email: string;
  taxPercentage: number;
  currencySymbol: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyConfigService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/companyconfig`;

  getConfig(): Observable<CompanyConfig> {
    return this.http.get<CompanyConfig>(this.apiUrl);
  }

  updateConfig(config: CompanyConfig): Observable<any> {
    return this.http.put(this.apiUrl, config);
  }
}
