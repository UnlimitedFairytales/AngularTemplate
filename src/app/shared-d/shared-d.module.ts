import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { NgSelectModule } from '@ng-select/ng-select';

import { AppLocaleTextPipe } from './locale/app-locale-text.pipe';
import { ValidateDirective } from './ngx-form/validate.directive';
import { DatepickerExDirective } from './bs-wrapper/datepicker-ex.directive';

import { AgGridModule } from 'ag-grid-angular';

// Declarable module.
// このNgModuleは、全てのNgModuleでNg importsされることを意図している
@NgModule({
  declarations: [
    AppLocaleTextPipe,
    ValidateDirective,
    DatepickerExDirective,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    AccordionModule,
    ButtonsModule,
    BsDatepickerModule,
    BsDropdownModule,
    CollapseModule,
    ModalModule,
    PaginationModule,
    PopoverModule,
    ProgressbarModule,
    TabsModule,
    TimepickerModule,
    TooltipModule,
    TypeaheadModule,

    NgSelectModule,

    AppLocaleTextPipe,
    ValidateDirective,
    DatepickerExDirective,

    AgGridModule,
  ],
})
export class SharedDModule { }
