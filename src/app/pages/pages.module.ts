import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PagesComponent } from './pages.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PagesRoutingModule } from './page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PagesRoutingModule,
    PagesComponent,
    ChangePasswordComponent,
  ],
  declarations: [],
})
export class PagesModule {}
