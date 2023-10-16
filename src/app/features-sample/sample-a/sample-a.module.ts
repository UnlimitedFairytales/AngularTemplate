import { NgModule } from '@angular/core';
import { SharedDModule } from 'src/app/shared-d/shared-d.module';
import { FeaturesSampleModule } from '../features-sample.module';

import { SampleARoutingModule } from './sample-a-routing.module';
import { SampleA1Component } from './sample-a1/sample-a1.component';
import { SampleA2Component } from './sample-a2/sample-a2.component';
import { SampleA2DialogComponent } from './sample-a2/sample-a2-dialog/sample-a2-dialog.component';
import { SampleA3SearchPageComponent } from './sample-a3-search-page/sample-a3-search-page.component';
import { SampleA4EditPageComponent } from './sample-a4-edit-page/sample-a4-edit-page.component';

@NgModule({
  declarations: [
    SampleA1Component,
    SampleA2Component,
    SampleA2DialogComponent,
    SampleA3SearchPageComponent,
    SampleA4EditPageComponent
  ],
  imports: [
    SharedDModule,
    SampleARoutingModule,
    FeaturesSampleModule,
  ]
})
export class SampleAModule { }
