import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageTemplateListComponent } from './pages/list/list.component';
import { MessageTemplateFormComponent } from './pages/form/form.component';
import { MessageTemplateDetailsComponent } from './pages/details/details.component';
import { EditorGuard } from '../../core/guards/editor.guard';

const routes: Routes = [
  {
    path: '',
    component: MessageTemplateListComponent,
  },
  {
    path: 'create',
    component: MessageTemplateFormComponent,
    canActivate: [EditorGuard],
  },
  {
    path: 'edit/:id',
    component: MessageTemplateFormComponent,
    canActivate: [EditorGuard],
  },
  {
    path: 'details/:id',
    component: MessageTemplateDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageTemplatesRoutingModule {}
