import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sanction, SanctionConfig, UpdateSanctionConfigRequest } from '../../../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class SanctionService {
  private http = inject(HttpClient);
  private apiUrl = 'https://proyecto2526backend-adrian140604-2.onrender.com/api/sanctions';
  private configUrl = 'https://proyecto2526backend-adrian140604-2.onrender.com/api/sanction-config';

  getMySanctions(): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.apiUrl}/my-sanctions`);
  }

  getAllSanctions(): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(this.apiUrl);
  }

  getActiveSanctions(): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.apiUrl}/active`);
  }
  
  getConfig(): Observable<SanctionConfig> {
    return this.http.get<SanctionConfig>(this.configUrl);
  }

  updateConfig(request: UpdateSanctionConfigRequest): Observable<SanctionConfig> {
    return this.http.put<SanctionConfig>(this.configUrl, request);
  }
}
