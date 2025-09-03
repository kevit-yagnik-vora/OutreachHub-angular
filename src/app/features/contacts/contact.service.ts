import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContact } from './model/contact.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { WorkspaceService } from '../../core/services/workspace.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private baseUrl = `${environment.apiUrl}/contact`;

  constructor(
    private http: HttpClient,
    private workspaceService: WorkspaceService
  ) {}

  private getWorkspaceIdOrThrow(): string {
    const id = this.workspaceService.getWorkspaceId();
    if (!id) {
      throw new Error('No workspace selected');
    }
    return id;
  }

  /** Get all contacts for selected workspace */
  getContacts(page: number, limit: number): Observable<any> {
    const workspaceId = this.getWorkspaceIdOrThrow();
    return this.http.get<any>(
      `${this.baseUrl}/byWorkspace/${workspaceId}?page=${page}&limit=${limit}`
    );
  }

  getContactById(id: string): Observable<IContact> {
    return this.http.get<IContact>(`${this.baseUrl}/${id}`);
  }

  createContact(contact: IContact): Observable<IContact> {
    const workspaceId = this.getWorkspaceIdOrThrow();
    return this.http.post<IContact>(`${this.baseUrl}/createContact`, {
      ...contact,
      workspaceId,
    });
  }

  updateContact(id: string, contact: IContact): Observable<IContact> {
    const workspaceId = this.getWorkspaceIdOrThrow();
    return this.http.put<IContact>(`${this.baseUrl}/${id}`, {
      ...contact,
      workspaceId,
    });
  }

  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
