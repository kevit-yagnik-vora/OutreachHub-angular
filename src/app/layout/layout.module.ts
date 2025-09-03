import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [
    AuthLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class LayoutModule {}
