import { Component, InjectionToken } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppAnimations } from 'src/app/utils/ngx/app-animations';
import { AppMessageBoxService } from '../../bs-wrapper/app-message-box.service';
import { AppModalComponent, AppModalDoneFunc } from '../../bs-wrapper/app-modal-component';
import { AppLocaleService } from '../../locale/app-locale.service';
import { AppValidators } from '../../ngx-form/app-validators';
import { AppAjaxService, AppJsonResult } from '../../ngx-http/app-ajax.service';

export const APP_LOGIN_DIALOG_COMPONENT_INITIAL_DATA = new InjectionToken<AppLoginDialogComponentInitialData>('appLoginDialogComponentInitialData');

export type GetDialogModeResult = AppJsonResult & { IsResetPass: number };
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AppLoginDialogComponentInitialData = {
  endpoint_GetDialogMode: string,
  endpoint_SetUserPassword: string,
  endpoint_Login: string,
  hasCloseButton: boolean
}
type LoginStep = 'step1_UserCd' | 'step2_Password';

@Component({
  selector: 'app-app-login-dialog',
  templateUrl: './app-login-dialog.component.html',
  styleUrls: ['./app-login-dialog.component.scss'],
  animations: [AppAnimations.openClose()]
})
export class AppLoginDialogComponent implements AppModalComponent<AppLoginDialogComponentInitialData, unknown> {

  /* implements AppModalComponent<TInitialData, TResultData> */
  initialData?: AppLoginDialogComponentInitialData;
  /* implements AppModalComponent<TInitialData, TResultData> */
  done?: AppModalDoneFunc<unknown>;

  protected loginForm: FormGroup;
  protected isResetPass = false;
  protected _loginStep: LoginStep = 'step1_UserCd';
  protected get loginStep(): LoginStep { return this._loginStep }
  protected set loginStep(value: LoginStep) {
    console.log(`loginStep to ${value}`);
    this._loginStep = value;
  }
  protected get isStep1() { return this.loginStep === 'step1_UserCd' }
  protected get isStep2() { return this.loginStep === 'step2_Password' }

  protected errorMessage?: string;

  constructor(
    protected formBuilder: FormBuilder,
    protected appValidators: AppValidators,
    protected appLocaleService: AppLocaleService,
    protected appAjaxService: AppAjaxService,
    protected appMessageBoxService: AppMessageBoxService) {

    const l = appLocaleService;
    this.loginForm = this.formBuilder.group({
      UserCd: [null, [AppValidators.required(l.msg('W3003', [l.txt('LOGIN.UserCd')]))]],
      Password: [null, [AppValidators.other((ctl) =>
        this.isStep2 && !ctl.value ? l.msg('W3003', [l.txt('LOGIN.Password')]) : null)]]
    });
  }

  back(): void {
    this.loginStep = 'step1_UserCd';
    this.isResetPass = false;
  }

  async doAsync(): Promise<void> {
    this.errorMessage = undefined;
    if (this.isStep1) {
      if (!this.validateCtl('UserCd')) return;
      await this.checkAndMoveToStep2Async();
      return;
    }

    if (this.isResetPass) {
      if (!this.validateCtl('UserCd')) return;
      // if (!this.validateCtl('Password')) return;
      if (!await this.resetsPassAsync()) return;
    }
    await this.loginAsync();
  }

  protected validateCtl(name: string) {
    console.log(`validateCtl:${name}`);
    const ctl = this.loginForm.get(name);
    ctl?.markAsDirty();
    ctl?.updateValueAndValidity({ emitEvent: false });
    const result = ctl?.valid;
    console.log(result);
    return result;
  }

  protected async checkAndMoveToStep2Async(): Promise<void> {
    console.log('checkAndMoveToStep2Async');
    const postData = { UserCd: this.loginForm.value.UserCd };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await this.appAjaxService.postAsync<GetDialogModeResult>(this.initialData!.endpoint_GetDialogMode, postData);
    if (result.MessageId) {
      this.errorMessage = this.appLocaleService.getLocaleMessage(result.MessageId);
      return;
    }

    this.loginStep = 'step2_Password';
    if (result.IsResetPass === 1) {
      this.isResetPass = true;
    }
  }

  protected async resetsPassAsync(): Promise<boolean> {
    console.log('resetsPassAsync');
    const postData = Object.assign({}, this.loginForm.value);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await this.appAjaxService.postAsync<AppJsonResult>(this.initialData!.endpoint_SetUserPassword, postData);
    if (result.MessageId) {
      this.errorMessage = this.appLocaleService.getLocaleMessage(result.MessageId);
      this.loginStep = 'step1_UserCd';
      this.isResetPass = false;
      this.loginForm.reset();
      return false;
    }
    return true;
  }

  protected async loginAsync() {
    console.log('loginAsync');
    const postData = Object.assign({}, this.loginForm.value);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await this.appAjaxService.postAsync<AppJsonResult>(this.initialData!.endpoint_Login, postData);
    if (result.MessageId) {
      this.errorMessage = this.appLocaleService.getLocaleMessage(result.MessageId);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.done!({ isCanceled: false });
  }

  protected close() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.done!({ isCanceled: true });
  }
}
