import { NgModule } from '@angular/core';
import { SharedDModule } from '../shared-d/shared-d.module';

import { SampleLinksComponent } from './sample-links/sample-links.component';

@NgModule({
  declarations: [
    SampleLinksComponent
  ],
  imports: [
    SharedDModule,
  ],
  exports: [
    SampleLinksComponent
  ]
})
export class FeaturesSampleModule { }
