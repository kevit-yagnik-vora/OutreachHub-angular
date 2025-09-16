import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageTemplatesRoutingModule } from './message-templates-routing.module';
import { TemplateCardComponent } from './components/template-card/template-card.component';
import { MessageTemplateListComponent } from './pages/list/list.component';
import { MessageTemplateFormComponent } from './pages/form/form.component';
import { MessageTemplateDetailsComponent } from './pages/details/details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TemplateCardComponent,
    MessageTemplateListComponent,
    MessageTemplateFormComponent,
    MessageTemplateDetailsComponent
  ],
  imports: [
    CommonModule,
    MessageTemplatesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
})
export class MessageTemplatesModule {}
