import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessageTemplateService {
  private baseUrl = `${environment.apiUrl}/message-template`; // adjust to your API path

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    console.log({ id, data });
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getByWorkspace(
    workspaceId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/byWorkspace/${workspaceId}?page=${page}&limit=${limit}`
    );
  }

  getAllByWorkspace(
    workspaceId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/all/byWorkspace/${workspaceId}?page=${page}&limit=${limit}`
    );
  }

  listByWorkspace(workspaceId: string, page = 1, limit = 100): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/all/byWorkspace/${workspaceId}?page=${page}&limit=${limit}`
    );
  }
}
