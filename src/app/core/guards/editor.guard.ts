import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { RoleService } from '../services/role.service';

@Injectable({ providedIn: 'root' })
export class EditorGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.roleService.isEditor()) {
      return true;
    }
    return this.router.parseUrl('/no-access');
  }
}
