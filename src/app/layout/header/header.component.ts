import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { WorkspaceService } from '../../core/services/workspace.service';

interface IUserWorkspace {
  workspace: {
    _id: string;
    name: string;
  };
  role: string;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
  workspaces: IUserWorkspace[];
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}
  mobileMenuOpen = false;
  scrolled = false;
  selectedWorkspace: IUserWorkspace | null = null;

  user!: IUser;
  ngOnInit() {
    const raw = localStorage.getItem('user');
    if (raw) {
      this.user = JSON.parse(raw);
    }

    // 2) Try to get stored workspace from service/localStorage
    const stored = this.workspaceService.getWorkspace();

    if (stored && this.user?.workspaces?.length) {
      // Remap to the SAME object instance from user.workspaces
      const match = this.user.workspaces.find(
        (w: any) =>
          w?.workspace?._id === stored?.workspace?._id &&
          w?.role === stored?.role
      );
      if (match) {
        this.selectedWorkspace = match;
      } else {
        // fallback to first, and store it
        this.selectedWorkspace = this.user.workspaces[0];
        this.workspaceService.setWorkspace(this.selectedWorkspace);
      }
    } else if (this.user?.workspaces?.length) {
      // 3) Nothing stored: default to first workspace and store it
      this.selectedWorkspace = this.user.workspaces[0];
      this.workspaceService.setWorkspace(this.selectedWorkspace);
    } else {
      this.selectedWorkspace = null;
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

  // IMPORTANT: compare by business identity, not object reference
  compareWorkspaces = (a: any, b: any): boolean => {
    if (!a || !b) return a === b;
    return a.workspace?._id === b.workspace?._id && a.role === b.role;
  };

  // This receives the whole workspace object (because we'll bind with ngValue)
  onWorkspaceChange(ws: any) {
    this.selectedWorkspace = ws;
    this.workspaceService.setWorkspace(ws);
    console.log('Switched to workspace', ws);
    this.router.navigateByUrl('/');
    // Optionally: emit analytics/log or navigate
  }
}
