import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'sample-a', loadChildren: () => import('./features-sample/sample-a/sample-a.module').then(m => m.SampleAModule) },
  { path: 'sample-b', loadChildren: () => import('./features-sample/sample-b/sample-b.module').then(m => m.SampleBModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
