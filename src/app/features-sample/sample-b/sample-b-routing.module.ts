import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appIsAuthorizedGuard } from 'src/app/shared-p/ngx-guard/app-is-authorized.guard';
import { SampleB1Component } from './sample-b1/sample-b1.component';

const routes: Routes = [
  { path: 'sample-b1', component: SampleB1Component, canActivate: [appIsAuthorizedGuard] },
  { path: '', redirectTo: 'sample-b1', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleBRoutingModule { }
