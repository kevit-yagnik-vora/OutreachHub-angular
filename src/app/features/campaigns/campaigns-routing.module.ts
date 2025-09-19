import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignListComponent } from './pages/list/list.component';
import { CampaignFormComponent } from './pages/form/form.component';
import { EditorGuard } from '../../core/guards/editor.guard';
import { CampaignDetailsComponent } from './pages/details/details.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignListComponent,
  },
  {
    path: 'new',
    component: CampaignFormComponent,
    canActivate: [EditorGuard],
  },
  {
    path: 'edit/:id',
    component: CampaignFormComponent,
    canActivate: [EditorGuard],
  },
  {
    path: ':id',
    component: CampaignDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignsRoutingModule {}
