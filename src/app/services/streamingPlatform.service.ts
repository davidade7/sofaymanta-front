import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StreamingPlatform } from '../models/streaming-platform.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StreamingPlatformService {
  private apiUrl = `${environment.apiUrl}/streaming-platforms`;

  constructor(private http: HttpClient) {}

  create(streamingPlatform: Omit<StreamingPlatform, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Observable<StreamingPlatform> {
    return this.http.post<StreamingPlatform>(this.apiUrl, streamingPlatform);
  }

  findAll(activeOnly?: boolean): Observable<StreamingPlatform[]> {
    let params = new HttpParams();
    if (activeOnly !== undefined) {
      params = params.set('activeOnly', activeOnly.toString());
    }
    return this.http.get<StreamingPlatform[]>(this.apiUrl, { params });
  }

  findOne(id: string): Observable<StreamingPlatform> {
    return this.http.get<StreamingPlatform>(`${this.apiUrl}/${id}`);
  }

  findByCode(code: string): Observable<StreamingPlatform> {
    return this.http.get<StreamingPlatform>(`${this.apiUrl}/code/${code}`);
  }

  update(id: string, streamingPlatform: Partial<StreamingPlatform>): Observable<StreamingPlatform> {
    return this.http.patch<StreamingPlatform>(`${this.apiUrl}/${id}`, streamingPlatform);
  }

  toggleActive(id: string): Observable<StreamingPlatform> {
    return this.http.patch<StreamingPlatform>(`${this.apiUrl}/${id}/toggle-active`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
