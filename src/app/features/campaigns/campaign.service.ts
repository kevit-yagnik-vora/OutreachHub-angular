import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private base = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  listByWorkspace(workspaceId: string, page = 1, limit = 10): Observable<any> {
    return this.http.get(
      `${this.base}/byWorkspace/${workspaceId}?page=${page}&limit=${limit}`
    );
  }

  get(id: string) {
    return this.http.get(`${this.base}/${id}`);
  }

  create(payload: any) {
    return this.http.post(this.base, payload);
  }

  update(id: string, payload: any) {
    return this.http.put(`${this.base}/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }

  copy(id: string) {
    return this.http.post(`${this.base}/${id}/copy`, {});
  }

  launch(id: string) {
    return this.http.post(`${this.base}/${id}/launch`, {});
  }

  getMessages(id: string, page = 1, limit = 20) {
    return this.http.get(
      `${this.base}/${id}/messages?page=${page}&limit=${limit}`
    );
  }

  getSummary(id: string) {
    return this.http.get(`${this.base}/${id}/summary`);
  }

  // helper to count contacts for selected tags
  countContactsByTags(
    workspaceId: string,
    tags: string[]
  ): Observable<{ count: number }> {
    // backend endpoint: GET /contacts/count?workspaceId=...&tags=tag1,tag2
    const q = tags.join(',');
    return this.http.get<{ count: number }>(
      `${
        environment.apiUrl
      }/contact/count?workspaceId=${workspaceId}&tags=${encodeURIComponent(q)}`
    );
  }

  // backend endpoint should accept workspaceId and comma separated tags e.g.
  // GET /contacts/count?workspaceId=...&tags=tag1,tag2
  // countContactsByTags(
  //   workspaceId: string,
  //   tags: string[]
  // ): Observable<{ count: number }> {
  //   const tagParam = encodeURIComponent(tags.join(','));
  //   return this.http.get<{ count: number }>(
  //     `${environment.apiUrl}/contact/count?workspaceId=${workspaceId}&tags=${tagParam}`
  //   );
  // }
}
