import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, forwardRef, HostBinding, Input, OnChanges, OnDestroy, OnInit, Provider, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { formatDate, getLocale, isAfter, isBefore, isDate, isDateValid, parseDate, utcAsLocal } from 'ngx-bootstrap/chronos';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { BsDatepickerConfig, BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { AppDate } from 'src/app/utils/helpers/app-date';

const APP_DATEPICKER_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerExDirective),
  multi: true
};

const APP_DATEPICKER_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DatepickerExDirective),
  multi: true
};

/**
 * ngx-bootstrap v11.0.2の BsDatepickerDirective, BsDatepickerInputDirectiveを参考にした実装。
 * 実用する最低限の再実装にしているので、大半の実装は端折られてます。
 * 
 * 概要
 * BsDatepickerDirectiveは、BsDatepickerComponentのConfig保持や表示・クローズなどを司る。input要素とは関わりを持たない
 * BsDatepickerInputDirectiveが、input要素やReactive Formと直接やり取りをする部分。ControlValueAccessorに従って相互の通知が行われる。本クラスはこれを再実装して微調整したもの
 * ControlValueAccessorの各メソッドは、input要素やReactive Formのセットアップの際に、自動でそれぞれが呼ばれセットアップが完了する
 * - writeValue : Reactive Fromの値が変更された際に呼ばれる（Reactive Form -> UI）
 * - registerOnChange : 初期化時？にフレームワークが呼ぶ。受け取ったコールバックを実際に呼ぶと、Reactive Formへ値が渡る。
 *      - input要素と連携する場合、単にhostのinputのchangeイベントのハンドラを用意して、その中でコールバックを呼ぶ実装をすることが多い（UI -> Reactive Form の対応）
 *      - 自作コンポーネントと連携する場合、自作コンポーネントが管理する値が変更される際に呼び出す、といった実装をすることが多い（UI -> Reactive Form の対応）
 * - registerOnTouched : 初期化時？にフレームワークが呼ぶ。受け取ったコールバックを実際に呼ぶと、Reactive Formは触られた事を通知する。概ねValidateやエラーチェックなどの目的
 * - setDisabledState : Reactive Form側が有効・無効になった際に呼ばれる（Reactive Form -> UI）
 */
@Directive({
  selector: 'input[appDatepickerEx]',
  exportAs: 'appDatepickerEx',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '(change)': 'onChange_BsDatepickerInputDirective($event)',
    // '(keyup.esc)': 'hide()',
    // '(keydown)': 'onKeydownEvent($event)',
    '(blur)': 'onBlur_BsDatepickerInputDirective()'
  },
  providers: [APP_DATEPICKER_VALUE_ACCESSOR, APP_DATEPICKER_VALIDATOR]
})
export class DatepickerExDirective implements
  /* ****************************************
   *  BsDatepickerDirective 's implements
   * ****************************************/
  OnInit, OnDestroy, OnChanges, AfterViewInit,
  /* ****************************************
   *  BsDatepickerInputDirective 's implements
   * ****************************************/
  ControlValueAccessor, Validator {

  private _picker: BsDatepickerDirective;
  /* ****************************************
   *  BsDatepickerDirective 's fields/properties
   * ****************************************/
  // @Input() placement
  // @Input() triggers
  // @Input() outsideClick
  // @Input() container
  // @Input() outsideEsc
  // @Output() onShown
  // @Output() onHidden
  // isOpen$
  // isDestroy$
  // @Input() isDisabled
  // @Input() minDate
  // @Input() maxDate
  // @Input() minMode
  // @Input() daysDisabled
  // @Input() datesDisabled
  // @Input() datesEnabled
  // @Input() dateCustomClasses
  // @Input() dateTooltipTexts
  // @Output() bsValueChange
  @HostBinding('attr.readonly') get readonlyValue() {
    return this._picker.isDisabled ? '' : null;
  }
  // protected _subs
  // private _datepicker
  // private _datepickerRef
  // private readonly _dateInputFormat

  /* ****************************************
   *  BsDatepickerInputDirective 's fields/properties
   * ****************************************/
  private _onChange = Function.prototype;
  private _onTouched = Function.prototype;
  private _validatorChange = Function.prototype;
  private _value?: Date;
  private _subs = new Subscription();

  constructor(
    /* ****************************************
     *  BsDatepickerDirective 's fields/parameters
     * ****************************************/
    public _config: BsDatepickerConfig,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    _viewContainerRef: ViewContainerRef,
    cis: ComponentLoaderFactory,
    /* ****************************************
     *  BsDatepickerInputDirective fields/parameters
     * ****************************************/
    private _localeService: BsLocaleService,
    private changeDetection: ChangeDetectorRef
  ) {
    this._picker = new BsDatepickerDirective(_config, _elementRef, _renderer, _viewContainerRef, cis);
  }

  /* ****************************************
   *  BsDatepickerDirective 's methods
   * ****************************************/
  // get isOpen(): boolean
  // set isOpen(value: boolean)
  // _bsValue?: Date
  // set bsValue(value: Date | undefined)
  // get dateInputFormat$(): Observable<string | undefined>
  @Input()
  get bsConfig(): Partial<BsDatepickerConfig> | undefined { return this._picker.bsConfig; }
  set bsConfig(value: Partial<BsDatepickerConfig> | undefined) { this._picker.bsConfig = value; }

  /* implements OnInit */
  ngOnInit() {
    this._picker.ngOnInit();
    this.ngOnInit_BsDatepickerInputDirective();
  }

  // initPreviousValue()

  /* implements OnChanges */
  ngOnChanges(changes: SimpleChanges): void {
    this._picker.ngOnChanges(changes);
  }

  // initSubscribes()
  // keepDatepickerModalOpened()
  // isDateSame()

  /* implements AfterViewInit */
  ngAfterViewInit(): void {
    this._picker.ngAfterViewInit();
  }

  // show()
  // hide()
  // toggle()
  // setConfig()
  // unsubscribeSubscriptions()

  /* implements OnDestroy */
  ngOnDestroy() {
    this._picker.ngOnDestroy();
    this.ngOnDestroy_BsDatepickerInputDirective();
  }

  /* ****************************************
   *  BsDatepickerInputDirective 's methods
   * ****************************************/
  ngOnInit_BsDatepickerInputDirective() {
    const setBsValue = (value: Date) => {
      this._setInputValue(value);
      if (this._value !== value) {
        this._value = value;
        this._onChange(this._valueYYYYMMDDLike());
        this._onTouched();
      }
      this.changeDetection.markForCheck();
    };

    // if value set via [bsValue] it will not get into value change
    if (this._picker._bsValue) {
      setBsValue(this._picker._bsValue);
    }

    // update input value on datepicker value update
    this._subs.add(
      this._picker.bsValueChange.subscribe(setBsValue)
    );

    // update input value on locale change
    this._subs.add(
      this._localeService.localeChange.subscribe(() => {
        this._setInputValue(this._value);
      })
    );

    this._subs.add(
      this._picker.dateInputFormat$.pipe(distinctUntilChanged()).subscribe(() => {
        this._setInputValue(this._value);
      })
    );
  }

  ngOnDestroy_BsDatepickerInputDirective() {
    this._subs.unsubscribe();
  }

  // onKeydownEvent(event: KeyboardEvent)

  _setInputValue(value?: Date): void {
    const initialDate = !value ? ''
      : formatDate(value, this._picker._config.dateInputFormat, this._localeService.currentLocale);

    this._renderer.setProperty(this._elementRef.nativeElement, 'value', initialDate);
  }

  onChange_BsDatepickerInputDirective(event: Event) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    this.writeValue((event.target as any).value);
    this._onChange(this._valueYYYYMMDDLike());
    if (this._picker._config.returnFocusToInput) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this._renderer.selectRootElement(this._elementRef.nativeElement).focus();
    }
    this._onTouched();
  }

  /* implements Validator */
  validate(c: AbstractControl): ValidationErrors | null {
    const _value: Date | string = c.value;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (_value === null || _value === undefined || _value === '') {
      return null;
    }

    if (isDate(_value)) {
      const _isDateValid = isDateValid(_value);
      if (!_isDateValid) {
        return { bsDate: { invalid: _value } };
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-optional-chain
      if (this._picker && this._picker.minDate && isBefore(_value, this._picker.minDate, 'date')) {
        this.writeValue(this._picker.minDate);

        return { bsDate: { minDate: this._picker.minDate } };
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-optional-chain
      if (this._picker && this._picker.maxDate && isAfter(_value, this._picker.maxDate, 'date')) {
        this.writeValue(this._picker.maxDate);

        return { bsDate: { maxDate: this._picker.maxDate } };
      }
    }

    return null;
  }
  /* implements Validator */
  registerOnValidatorChange(fn: () => void): void {
    this._validatorChange = fn;
  }

  /* implements ControlValueAccessor */
  writeValue(value: Date | string) {
    if (!value) {
      this._value = void 0;
    } else {
      const _localeKey = this._localeService.currentLocale;
      const _locale = getLocale(_localeKey);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!_locale) {
        throw new Error(
          `Locale "${_localeKey}" is not defined, please add it with "defineLocale(...)"`
        );
      }

      this._value = parseDate(value, this._picker._config.dateInputFormat, this._localeService.currentLocale);

      if (this._picker._config.useUtc) {
        this._value = utcAsLocal(this._value);
      }
    }

    this._picker.bsValue = this._value;
  }
  /* implements ControlValueAccessor */
  setDisabledState(isDisabled: boolean): void {
    this._picker.isDisabled = isDisabled;
    if (isDisabled) {
      this._renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'disabled');

      return;
    }
    this._renderer.removeAttribute(this._elementRef.nativeElement, 'disabled');
  }
  /* implements ControlValueAccessor */
  registerOnChange(fn: () => void): void {
    this._onChange = fn;
  }
  /* implements ControlValueAccessor */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  onBlur_BsDatepickerInputDirective() {
    this._onTouched();
  }

  hide() {
    this._picker.hide();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this._renderer.selectRootElement(this._elementRef.nativeElement).blur();
    if (this._picker._config.returnFocusToInput) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this._renderer.selectRootElement(this._elementRef.nativeElement).focus();
    }
  }

  private _valueYYYYMMDDLike(): string | undefined {
    // dateInputFormat is moment.js
    // https://valor-software.com/ngx-bootstrap/#/components/datepicker?tab=overview#format
    console.log(this._value);
    if (this._value === undefined) {
      return undefined;
    }
    if (this._value.toString() === 'Invalid Date') {
      return undefined;
    }
    else if (this._picker._config.dateInputFormat === 'YYYY') {
      return AppDate.toYYYY(this._value)
    }
    else if (this._picker._config.dateInputFormat.includes('D')) {
      return AppDate.toYYYYMMDD(this._value)
    }
    return AppDate.toYYYYMM(this._value)
  }
}