import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CampaignFormComponent } from './pages/form/form.component';
import { DetailsComponent } from './pages/details/details.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { RouterModule } from '@angular/router';
import { CampaignListComponent } from './pages/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DetailsComponent, MessagesComponent, CampaignListComponent, CampaignFormComponent],
  imports: [
    CommonModule,
    CampaignsRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CampaignsModule {}
