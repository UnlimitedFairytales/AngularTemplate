import { Component, Inject } from '@angular/core';
import { from, lastValueFrom, timeout } from 'rxjs';
import { AppAjaxService } from 'src/app/shared-p/ngx-http/app-ajax.service';
import { AppAnimations } from 'src/app/utils/ngx/app-animations';
import { AppMessageBoxButton, AppMessageBoxService } from 'src/app/shared-p/bs-wrapper/app-message-box.service';
import { AppModalService } from 'src/app/shared-p/bs-wrapper/app-modal.service';
import { SampleA2DialogComponent } from './sample-a2-dialog/sample-a2-dialog.component';
import { Debounce } from 'src/app/utils/decorators/debounce';
import { AppLocaleService } from 'src/app/shared-p/locale/app-locale.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppIsSaved } from 'src/app/shared-p/ngx-guard/app-is-saved';
import { AppObject } from 'src/app/utils/helpers/app-object';
import { AppValidators } from 'src/app/shared-p/ngx-form/app-validators';
import { AppLoginDialogComponent, AppLoginDialogComponentInitialData, APP_LOGIN_DIALOG_COMPONENT_INITIAL_DATA } from 'src/app/shared-p/auth/app-login-dialog/app-login-dialog.component';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AppBsDatepickerConfig } from 'src/app/utils/ngx-bootstrap-helpers/app-bs-datepicker.config';
import { AppDate } from 'src/app/utils/helpers/app-date';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AppAgGridValidationBinder, CommonParams } from 'src/app/shared-p/ag-grid/app-ag-grid-validation-binder';

@Component({
  selector: 'app-sample-a2',
  templateUrl: './sample-a2.component.html',
  styleUrls: ['./sample-a2.component.scss'],
  animations: [AppAnimations.openClose('slowOpenClose', '2000ms', 'cubic-bezier(0.5, 0, 0.1, 1)'), AppAnimations.openClose('fastOpenClose', '100ms')]
})
export class SampleA2Component implements AppIsSaved {

  form: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgData: any;
  bsDatepickerConfig: BsDatepickerConfig;
  fruitsList = ([
    { 'Id': 1, 'Name': 'Apple', 'SortNum': 100 },
    { 'Id': 2, 'Name': 'Banana', 'SortNum': 200 },
    { 'Id': 3, 'Name': 'Cherry', 'SortNum': 300 },
    { 'Id': 4, 'Name': 'Durian', 'SortNum': 400 },
    { 'Id': 5, 'Name': 'Citrus', 'SortNum': 0 },
  ]).sort((a, b) => a.SortNum - b.SortNum);

  columnDefs: ColDef[] = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' }
  ];
  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 },
    { make: undefined, model: undefined, price: undefined },
    { make: 'Dummy', model: 'Unknown', price: 30000 },
    { make: 'Dummy', model: 'Unknown', price: 30000 },
    { make: 'Dummy', model: 'Unknown', price: 30000 },
    { make: 'Dummy', model: 'Unknown', price: 30000 },
    { make: 'Dummy', model: 'Unknown', price: 30000 },
    { make: 'Dummy', model: 'Unknown', price: 30000 }
  ];

  constructor(
    private appAjaxService: AppAjaxService,
    private appMessageBoxService: AppMessageBoxService,
    private appModalService: AppModalService,
    private appLocaleService: AppLocaleService,
    private formBuilder: FormBuilder,
    private appValidators: AppValidators,
    @Inject(APP_LOGIN_DIALOG_COMPONENT_INITIAL_DATA) private appLoginDialogComponentInitialData: AppLoginDialogComponentInitialData,
    private bsLocaleService: BsLocaleService) {

    const l = appLocaleService;
    const var2 = 'C0003';
    const var3 = '次郎';
    this.form = this.formBuilder.group({
      accountCode: [{ value: var2, disabled: false }, null],
      accountName: [{ value: var3, disabled: false }, null],
      minmax______: [{ value: null, disabled: false }, [AppValidators.required(l.msg('W2001')), AppValidators.min(l.msg('W2010', [-1]), -1), AppValidators.max(l.msg('W2011', [9]), 9)]],
      email_______: [{ value: null, disabled: false }, [AppValidators.required(l.msg('W2001')), AppValidators.email(l.msg('W2016'))]],
      minmaxlength: [{ value: null, disabled: false }, [AppValidators.minLength(l.msg('W2006', [3]), 3), AppValidators.maxLength(l.msg('W2007', [5]), 5)]],
      pattern_____: [{ value: null, disabled: false }, [AppValidators.pattern(l.msg('W2013'), '[12]+')]],
      number______: [{ value: null, disabled: false }, [AppValidators.number(l.msg('W2013'))]],
      integer_____: [{ value: null, disabled: false }, [AppValidators.integer(l.msg('W2014'))]],
      nonNegativeI: [{ value: null, disabled: false }, [AppValidators.nonNegativeInteger(l.msg('W2010', [0]))]],
      telephone___: [{ value: null, disabled: false }, [AppValidators.telephone(l.msg('W2015'))]],
      other_______: [{ value: null, disabled: false }, [AppValidators.other((c) => {
        console.log(c.value);
        return AppDate.isYYYYMMDDLike(c.value, 'yyyyMMdd') ? null : l.msg('W2017');
      })]],
      ngSelect____: [{ value: null, disabled: false }, null],
    });
    this.orgData = this.form.getRawValue();
    this.bsDatepickerConfig = Object.assign(AppBsDatepickerConfig.getConfigBase_Day(), {
      minDate: new Date('2020-04-01'),
      maxDate: new Date('2030-03-31')
    });
    this.grid2GridOptions = this.createGrid2GridOptions();
  }

  /* implements AppIsSaved */
  async isSavedAsync(): Promise<boolean> {
    console.log(this.orgData.accountCode);
    console.log(this.orgData.accountName);
    if (AppObject.stringifyEquals(this.orgData, this.form.getRawValue())) {
      return await Promise.resolve(true);
    }
    return await Promise.resolve(false);
  }

  throwError_click(): void {
    throw new Error('Error example.');
  }

  throwTimeoutErrorViaObservable_click(): void {
    const delay3sec = new Promise((resolve) => setTimeout(resolve, 3 * 1000));
    const src$ = from(delay3sec).pipe(timeout(0.5 * 1000));
    src$.subscribe(() => console.log('foo'));
  }

  async throwTimeoutErrorViaPromise_clickAsync(): Promise<void> {
    const delay3sec = new Promise((resolve) => setTimeout(resolve, 3 * 1000));
    const src$ = from(delay3sec).pipe(timeout(0.5 * 1000));
    await lastValueFrom(src$);
  }

  async xhrGet_clickAsync(): Promise<void> {
    // このエンドポイントはCORSが許可されているので、CORSエラーにならない
    const url = 'https://jsonplaceholder.typicode.com/albums';
    const result = await this.appAjaxService.getAsync(url);
    console.log(result);
  }

  async xhrPost_clickAsync(): Promise<void> {
    // このエンドポイントはCORSが許可されているので、CORSエラーにならない
    const url = 'https://jsonplaceholder.typicode.com/albums';
    const body = {
      "userId": 1,
      "title": "POST TEST!"
    };
    const result = await this.appAjaxService.postAsync(url, body);
    console.log(result);
  }

  isOpen1 = true;
  changeIsOpen1_click(): void {
    this.isOpen1 = !this.isOpen1;
  }

  isOpen2 = false;
  changeIsOpen2_click(): void {
    this.isOpen2 = !this.isOpen2;
  }

  async showMessageBox1_clickAsync(): Promise<void> {
    const result = await this.appMessageBoxService.showAsync('message box sample!');
    console.log(result === 0 ? 'OK!' : 'CANCEL!');
  }

  async showMessageBox2_clickAsync(): Promise<void> {
    const buttons: AppMessageBoxButton[] = [
      { name: 'Yes', cssClass: 'btn-primary' },
      { name: 'No', cssClass: 'btn-default' }
    ];
    const result = await this.appMessageBoxService.showAsync('message box sample!', 'YEAH!!!!', buttons);
    console.log(result === 0 ? 'Yes!' : 'No or Cancel!');
  }

  async showModal_clickAsync(): Promise<void> {
    const result = await this.appModalService.showAsync(SampleA2DialogComponent, { value: 'FOO!!' });
    console.log(result);
  }

  @Debounce(1000)
  debounce_click(): void {
    console.log('debounce_click called!');
  }

  setLocaleEnus_click(): void { this.setLocale('en-US'); }
  setLocaleJajp_click(): void { this.setLocale('ja-JP'); }
  private setLocale(l: string) {
    this.appLocaleService.storage_LocaleId = l;
    const bsLocale = AppBsDatepickerConfig.toBsLocaleServiceLocale(l);
    this.bsLocaleService.use(bsLocale);
    this.bsDatepickerConfig.clearButtonLabel = this.appLocaleService.getLocaleText('COMMON.BUTTON.CLEAR');
  }

  async showLocaledMessage_clickAsync(): Promise<void> {
    const msg = this.appLocaleService.getLocaleMessage('W2008', ['foo', 'bar']);
    await this.appMessageBoxService.showAsync(msg);
  }

  async validateAllAsync(): Promise<void> {
    console.log(this.form.value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    let hasError = this.appValidators.hasError([this.form]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    hasError = (this.grid2GridOptions.context.validationBinder as AppAgGridValidationBinder).hasError() || hasError;
    if (hasError) {
      const msg = this.appLocaleService.getLocaleMessage('W2000');
      await this.appMessageBoxService.showAsync(msg, undefined, [{ name: 'OK', cssClass: 'btn-cta' }]);
    }
  }

  async showLoginDialogAsync(): Promise<void> {
    const cloned = Object.assign({}, this.appLoginDialogComponentInitialData);
    cloned.hasCloseButton = true;
    const result = await this.appModalService.showAsync(AppLoginDialogComponent, cloned);
    console.log(result);
  }

  // https://stackoverflow.com/questions/65126992/aggrid-does-ongridready-fall-into-line-with-angular-hooks
  // https://www.ag-grid.com/javascript-data-grid/grid-options/
  // 要約：constructorでGridOptionsを初期化、gridReady以降でGridApiを使用
  // 1. 初期化順は、constructor > @Input > ngOnInit() > onGridReady()
  // 2. GridApiが使用可能になるのはonGridReadyから
  grid2GridOptions: GridOptions;
  private createGrid2GridOptions(): GridOptions {
    const l = this.appLocaleService;
    const options = {} as GridOptions;
    /* Community */
    options.animateRows = true;
    const colDefs = [
      {
        field: 'make',
        cellRendererParams: {
          validators: [{
            func: (params: CommonParams) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              return AppValidators.other(ctrl => {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                console.log(`row=${params.rowIndex ?? '?'}, col=${params.colDef?.field ?? '?'}, value=${params.value}`);
                return AppObject.isNullish(ctrl.value) ? l.msg('W2001') : null;
              });
            }
          }]
        }
      },
      { field: 'model', cellRendererParams: { validators: [AppValidators.required(l.msg('W2001'))] } },
      { field: 'price', cellRendererParams: { validators: [AppValidators.required(l.msg('W2001')), AppValidators.min(l.msg('W2010', [30000]), 30000)] } }
    ];
    options.columnDefs = colDefs;
    options.defaultColDef = {
      editable: true,
      filter: true,
      /* Enterprise */
      // menuTabs: ['filterMenuTab'],
      resizable: true,
      sortable: true,
      cellStyle: (params) => {
        if (!AppObject.isNullish(params.data.price) && 50000 <= params.data.price) {
          return { backgroundColor: 'lavenderblush' }
        }
        return { backgroundColor: 'white' }
      }
    };
    // options.domLayout = 'autoHeight';
    options.headerHeight = 24;
    // options.localeText = ...;
    options.rowHeight = 24;
    options.rowMultiSelectWithClick = true;
    options.rowSelection = 'multiple';
    options.suppressDragLeaveHidesColumns = true;
    options.suppressMovableColumns = false;
    options.suppressPaginationPanel = true;
    options.suppressRowClickSelection = true;
    /* Enterprise */
    // options.enableRangeSelection = true;
    // options.excelStyles = ...
    // options.sideBar = ...;
    // options.suppressContextMenu = true;
    const binder = new AppAgGridValidationBinder(options);
    options.context = {
      validationBinder: binder
    };
    return options;
  }
  grid2GridApi!: GridApi;
  grid2ColumnApi!: ColumnApi;
  grid2_onGridReady(params: GridReadyEvent) {
    this.grid2GridApi = params.api;
    this.grid2ColumnApi = params.columnApi;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.grid2GridApi.setRowData(AppObject.clone(this.rowData)!);
  }
}