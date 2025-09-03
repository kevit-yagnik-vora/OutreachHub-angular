import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContact } from './model/contact.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private baseUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  /** Helper: get currently selected workspace from localStorage */
  private getSelectedWorkspaceId(): string | null {
    const ws = localStorage.getItem('selectedWorkspace');
    if (!ws) return null;
    try {
      console.log(JSON.parse(ws)?.workspace?._id);
      return JSON.parse(ws)?.workspace?._id || null;
    } catch {
      return null;
    }
  }

  /** Get all contacts for selected workspace */
  getContacts(page: number, limit: number): Observable<any> {
    const workspaceId = this.getSelectedWorkspaceId();
    console.log('Selected Workspace ID:', workspaceId);
    if (!workspaceId) {
      throw new Error('No workspace selected');
    }

    return this.http.get<any>(
      `${this.baseUrl}/byWorkspace/${workspaceId}?page=${page}&limit=${limit}`
    );
  }

  /** Get single contact */
  getContactById(id: string): Observable<IContact> {
    return this.http.get<IContact>(`${this.baseUrl}/${id}`);
  }

  /** Create new contact in selected workspace */
  createContact(contact: IContact): Observable<IContact> {
    const workspaceId = this.getSelectedWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace selected');
    }

    return this.http.post<IContact>(`${this.baseUrl}/createContact`, {
      ...contact,
      workspaceId,
    });
  }

  /** Update contact in selected workspace */
  updateContact(id: string, contact: IContact): Observable<IContact> {
    const workspaceId = this.getSelectedWorkspaceId();
    if (!workspaceId) {
      throw new Error('No workspace selected');
    }

    return this.http.put<IContact>(`${this.baseUrl}/${id}`, {
      ...contact,
      workspaceId,
    });
  }

  /** Delete contact */
  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
