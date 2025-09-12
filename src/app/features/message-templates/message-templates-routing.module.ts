import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageTemplateListComponent } from './pages/list/list.component';
import { MessageTemplateFormComponent } from './pages/form/form.component';
import { MessageTemplateDetailsComponent } from './pages/details/details.component';

const routes: Routes = [
  { path: '', component: MessageTemplateListComponent },
  { path: 'create', component: MessageTemplateFormComponent },
  { path: 'edit/:id', component: MessageTemplateFormComponent },
  { path: 'details/:id', component: MessageTemplateDetailsComponent
    
   }, // 👈 NEW
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageTemplatesRoutingModule {}
