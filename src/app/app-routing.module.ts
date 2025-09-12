import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { NoAccessComponent } from './features/no-access/no-access.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('./features/contacts/contacts.module').then(
            (m) => m.ContactsModule
          ),
      },
      {
        path: 'message-templates',
        loadChildren: () =>
          import('./features/message-templates/message-templates.module').then(
            (m) => m.MessageTemplatesModule
          ),
      },
      {
        path: 'no-access',
        component: NoAccessComponent,
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./core/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
