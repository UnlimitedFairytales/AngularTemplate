import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedDModule } from '../shared-d/shared-d.module';
import { AppErrorHandler } from './ngx-error/app-error-handler';

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
    SharedDModule
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ]
})
export class SharedPModule { }
