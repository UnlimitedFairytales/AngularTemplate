import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleA1Component } from './sample-a1/sample-a1.component';

const routes: Routes = [
  { path: 'sample-a1', component: SampleA1Component },
  { path: '', redirectTo: 'sample-a1', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleARoutingModule { }
