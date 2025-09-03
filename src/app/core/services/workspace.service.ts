import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  // BehaviorSubject holds the currently selected workspace object { workspace: {...}, role: '...' }
  private selectedWorkspaceSubject = new BehaviorSubject<any | null>(null);
  selectedWorkspace$ = this.selectedWorkspaceSubject.asObservable();

  constructor() {
    // initialize from localStorage if present
    const raw = localStorage.getItem('selectedWorkspace');
    if (raw) {
      try {
        this.selectedWorkspaceSubject.next(JSON.parse(raw));
      } catch {
        localStorage.removeItem('selectedWorkspace');
      }
    }
  }

  setWorkspace(ws: any) {
    // ws should be the user-workspace object (contains workspace & role)
    localStorage.setItem('selectedWorkspace', JSON.stringify(ws));
    this.selectedWorkspaceSubject.next(ws);
  }

  getWorkspace() {
    return this.selectedWorkspaceSubject.value;
  }

  // convenience: return workspace id or null
  getWorkspaceId(): string | null {
    return this.getWorkspace()?.workspace?._id ?? null;
  }
}
