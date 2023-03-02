import { NgModule } from '@angular/core';
import { SharedDModule } from 'src/app/shared-d/shared-d.module';
import { FeaturesSampleModule } from '../features-sample.module';

import { SampleBRoutingModule } from './sample-b-routing.module';
import { SampleB1Component } from './sample-b1/sample-b1.component';

@NgModule({
  declarations: [
    SampleB1Component
  ],
  imports: [
    SharedDModule,
    SampleBRoutingModule,
    FeaturesSampleModule,
  ]
})
export class SampleBModule { }
