import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedDModule } from './shared-d/shared-d.module';
import { SharedPModule } from './shared-p/shared-p.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    SharedDModule,
    SharedPModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
