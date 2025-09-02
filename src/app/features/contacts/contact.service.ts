import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from './model/contact.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private baseUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient, private auth: AuthService) {}
  user = this.auth.getUserData();

  //   getContacts(query?: {
  //     workspaceId?: string;
  //     q?: string;
  //   }): Observable<Contact[]> {
  //     return this.http.get<Contact[]>(
  //       `${this.baseUrl}/byWorkspace/${this.user?.workspaces[0].workspaceId}`
  //     );
  //   }

  getContacts(page: number, limit: number): Observable<any> {
    const data = this.http.get<any>(
      `${this.baseUrl}/byWorkspace/${this.user?.workspaces[0].workspaceId}?page=${page}&limit=${limit}`
    );
      return data;
  }

  getContactById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.baseUrl}/createContact`, {
      ...contact,
      workspaceId: this.user?.workspaces?.[0]?.workspaceId,
    });
  }

  updateContact(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${id}`, {
      ...contact,
      workspaceId: this.user?.workspaces?.[0]?.workspaceId,
    });
  }

  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
