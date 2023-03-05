import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appconfig } from '../configuration/appconfig';
import { SharedDModule } from '../shared-d/shared-d.module';
import { AppErrorHandler } from './ngx-error/app-error-handler';
import { AppAjaxService, APP_AJAX_RETRY_COUNT, APP_AJAX_RETRY_DELAY_SEC, APP_AJAX_SERVER_URL } from './ngx-http/app-ajax.service';
import { AppTimeoutInterceptor, APP_HTTP_TIMEOUT_SEC } from './ngx-http/app-timeout-interceptor';

import { ModalModule } from 'ngx-bootstrap/modal';
import { AppMessageBoxService } from './bs-wrapper/app-message-box.service';
import { AppMessageBoxComponent } from './bs-wrapper/app-message-box/app-message-box.component';

// Provider module.
// このNgModuleは、ルートNgModuleによってのみNg importsされることを意図している
// DI要約：このNgModuleにproviderを明示すればシングルトン共有される
// DI詳細：
// 1. シングルトンDIするには、初期ロードされるNgModule群のどこかでprovidersを明示するか、サービス自体が@Injectable({ providedIn: 'root' })である必要がある
// 2. providerの探索順序（優先順位）は次の通り：現在のComponent > DOM祖先Component > 現在のInjector（3で後述） > ルートInjector
// 3. lazy loadingされたNgModuleのprovidersに明示したサービスは、そのNgModule配下用のInjectorが作成され登録される。ルートInjectorからは見えない
// 4. @Injectable({ providedIn: 'root' })は、初めて使用される際にルートInjectorに登録される（lazy loadingされてもルートInjectorに登録される）
@NgModule({
  imports: [
    SharedDModule,
    ModalModule.forRoot(), // provide BsModalService, ComponentLoaderFactory, PositioningService
  ],
  declarations: [
    AppMessageBoxComponent
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AppTimeoutInterceptor, multi: true },
    { provide: APP_HTTP_TIMEOUT_SEC, useValue: appconfig.appHttpTimeout_sec },

    FormBuilder,

    AppAjaxService,
    { provide: APP_AJAX_SERVER_URL, useValue: appconfig.appAjaxServerUrl },
    { provide: APP_AJAX_RETRY_COUNT, useValue: appconfig.appAjaxRetryCount },
    { provide: APP_AJAX_RETRY_DELAY_SEC, useValue: appconfig.appAjaxRetryDelay_sec },

    AppMessageBoxService,
  ]
})
export class SharedPModule { }
