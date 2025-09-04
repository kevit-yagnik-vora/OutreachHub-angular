import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoleService {
  getSelectedWorkspace() {
    const raw = localStorage.getItem('selectedWorkspace');
    return raw ? JSON.parse(raw) : null;
  }

  isEditor(): boolean {
    const ws = this.getSelectedWorkspace();
    return ws?.role === 'Editor';
  }

  isViewer(): boolean {
    const ws = this.getSelectedWorkspace();
    return ws?.role === 'Viewer';
  }
}
