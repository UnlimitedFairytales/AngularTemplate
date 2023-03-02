import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleB1Component } from './sample-b1/sample-b1.component';

const routes: Routes = [
  { path: 'sample-b1', component: SampleB1Component },
  { path: '', redirectTo: 'sample-b1', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleBRoutingModule { }
