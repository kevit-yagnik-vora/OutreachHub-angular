import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsListComponent } from './pages/contacts-list/contacts-list.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';
import { ContactDetailsComponent } from './pages/contact-details/contact-details.component';
import { EditorGuard } from '../../core/guards/editor.guard';

const routes: Routes = [
  {
    path: '',
    component: ContactsListComponent
  },
  {
    path: 'new',
    component: ContactFormComponent,
    canActivate: [EditorGuard],
  },
  {
    path: 'edit/:id',
    component: ContactFormComponent,
    canActivate: [EditorGuard],
  },
  {
    path: ':id',
    component: ContactDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
