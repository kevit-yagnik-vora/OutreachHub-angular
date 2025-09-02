import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsListComponent } from './pages/contacts-list/contacts-list.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';
import { ContactDetailsComponent } from './pages/contact-details/contact-details.component';

const routes: Routes = [
  { path: '', component: ContactsListComponent }, // /contacts
  { path: 'new', component: ContactFormComponent }, // /contacts/new
  { path: 'edit/:id', component: ContactFormComponent }, // /contacts/edit/123
  { path: ':id', component: ContactDetailsComponent }, // /contacts/123
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
