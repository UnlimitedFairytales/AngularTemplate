import { NgModule } from '@angular/core';
import { SharedDModule } from 'src/app/shared-d/shared-d.module';
import { FeaturesSampleModule } from '../features-sample.module';

import { SampleARoutingModule } from './sample-a-routing.module';
import { SampleA1Component } from './sample-a1/sample-a1.component';

@NgModule({
  declarations: [
    SampleA1Component
  ],
  imports: [
    SharedDModule,
    SampleARoutingModule,
    FeaturesSampleModule,
  ]
})
export class SampleAModule { }
