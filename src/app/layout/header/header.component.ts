import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface WorkspaceInfo {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserWorkspace {
  workspace: {
    _id: string;
    name: string;
  };
  role: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
  workspaces: UserWorkspace[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
  mobileMenuOpen = false;
  scrolled = false;

  workspaces: any[] = [];
  selectedWorkspace: UserWorkspace | null = null;

  user!: User;
  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

      // Load previously selected workspace from localStorage
      const saved = localStorage.getItem('selectedWorkspace');
      if (saved) {
        this.selectedWorkspace = JSON.parse(saved);
      } else if (this.user.workspaces?.length) {
        this.selectedWorkspace = this.user.workspaces[0];
        localStorage.setItem(
          'selectedWorkspace',
          JSON.stringify(this.selectedWorkspace)
        );
      }
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    localStorage.removeItem('selectedWorkspace');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 10; // true if user scrolls down
  }
  onWorkspaceChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    const ws = this.user.workspaces.find(
      (w: any) => w.workspace._id === selectedId
    );
    if (ws) {
      this.selectedWorkspace = ws;
      localStorage.setItem('selectedWorkspace', JSON.stringify(ws));
    }
  }
}
