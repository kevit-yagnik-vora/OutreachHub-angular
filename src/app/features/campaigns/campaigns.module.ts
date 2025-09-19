import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CampaignFormComponent } from './pages/form/form.component';
import { CampaignDetailsComponent } from './pages/details/details.component';
import { RouterModule } from '@angular/router';
import { CampaignListComponent } from './pages/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CampaignDetailsComponent,
    CampaignListComponent,
    CampaignFormComponent,
  ],
  imports: [
    CommonModule,
    CampaignsRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CampaignsModule {}
