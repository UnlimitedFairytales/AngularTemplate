import { Directive, ElementRef, HostBinding, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormControlName, FormGroupDirective, ValidationErrors } from '@angular/forms';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { TooltipConfig, TooltipDirective } from 'ngx-bootstrap/tooltip';

// https://getbootstrap.jp/docs/5.0/components/tooltips/
// https://valor-software.com/ngx-bootstrap/#/components/tooltip?tab=overview
@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective extends TooltipDirective implements OnInit {

  protected validateFormControl?: AbstractControl | null = null;

  constructor(
    _viewContainerRef: ViewContainerRef,
    cis: ComponentLoaderFactory,
    config: TooltipConfig,
    _elementRef: ElementRef,
    _renderer: Renderer2,
    _positionService: PositioningService,
    protected formControlName: FormControlName,
    protected formGroupDirective: FormGroupDirective,
  ) {
    super(_viewContainerRef, cis, config, _elementRef, _renderer, _positionService);

    this.container = 'body';
    this.containerClass = 'app-validate';
  }

  /* implements OnInit */
  override ngOnInit(): void {
    super.ngOnInit();

    // UNDONE: FormArrayに未対応
    if (typeof this.formControlName.name === 'string') {
      this.validateFormControl = this.formGroupDirective.form.get(this.formControlName.name);
    }
  }

  @HostBinding('class.app-validate-invalid')
  get hasInvalid(): boolean {
    if (!this.validateFormControl) return false;

    const result = (this.validateFormControl.invalid && (this.validateFormControl.dirty || this.validateFormControl.touched));
    if (result) {
      this.setTooltip(this.validateFormControl.errors);
    } else {
      this.clearTooltip();
    }
    return result;
  }

  protected setTooltip(errors: ValidationErrors | null): void {
    if (!errors) return;

    console.debug(errors);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const errorValueList = Object.keys(errors).map((val) => errors[val]);
    const msg = errorValueList[0].message;
    if (msg !== this.tooltip) {
      this.tooltip = msg;
    }
  }

  protected clearTooltip() {
    if (this.tooltip) {
      this.tooltip = undefined;
    }
  }
}
