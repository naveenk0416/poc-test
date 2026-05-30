import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirService {
  private apiUrl = 'http://localhost:5000/api/firs';

  constructor(private http: HttpClient) { }

  createFir(firData: any): Observable<any> {
    return this.http.post(this.apiUrl, firData);
  }

  getFirs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFirById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateFir(id: string, firData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, firData);
  }
}
