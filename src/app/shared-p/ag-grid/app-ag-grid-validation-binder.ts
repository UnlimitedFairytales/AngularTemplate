import { FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CellClassParams, CellClassRules, CellEditingStartedEvent, ColDef, ColGroupDef, Column, ColumnApi, ColumnGroup, GridApi, GridOptions, IRowNode, ITooltipParams, VirtualRowRemovedEvent } from "ag-grid-community";
import { AppObject } from "../../utils/helpers/app-object";

/**
 * カスタムValidatorを作る際、対応するセルのパラメータを受け取りたい場合はこの形式で用意する
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AppGridValidator = { func: (params: CommonParams) => ValidatorFn; }

// CellClassParams と ITooltipParams の共通プロパティ
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CommonParams = {
  api: GridApi,
  colDef?: ColDef | null,
  column?: Column | ColumnGroup | undefined,
  columnApi: ColumnApi,
  context: unknown,
  data?: unknown,
  node?: IRowNode | undefined,
  rowIndex?: number | null | undefined,
  value?: unknown,
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ReactiveCell = { formControl: FormControl; }

/**
 * ### 前提
 * 
 * - GridOptions.onGridReadyを差し替えるため、onGridReadyハンドラはアロー関数で記述してください
 * - ColDef.tooltipValueGetterを差し替えるため、tooltipValueGetterハンドラはアロー関数で記述してください
 * 
 * ### 使い方
 * 
 * 1. GridがReadyする前に、GridOptionsへ適用
 * 
 * ```cs
 * const binder = new AppAgGridValidationBinder(options);
 * options.context = {
 *   validationBinder: binder
 * };
 * ```
 * 
 * 2. 同様に、ColumnDef[]にValidatorFnやAppGridValidatorを追記
 * 
 * ```cs
 * const colDefs = [
 *   {
 *     field: 'make',
 *     cellRendererParams: {
 *       validators: [{
 *         func: (params: CommonParams) => {
 *           return AppValidators.other(ctrl => {
 *             console.log(`row=${params.rowIndex ?? '?'}, col=${params.colDef?.field ?? '?'}, value=${params.value}`);
 *             return null;
 *           })
 *         }
 *       }]
 *     }
 *   },
 *   { field: 'model', cellRendererParams: { validators: [AppValidators.required(l.msg('W2001'))] } },
 *   { field: 'price', cellRendererParams: { validators: [AppValidators.min(l.msg('W2010', [30000]), 30000)] } }
 * ];
 * options.columnDefs = colDefs;
 * ```
 */
export class AppAgGridValidationBinder {

  private cellCache = new ReactiveCellCache();

  /**
   * Validationエラーの一覧を取得する
   */
  get errorMessages(): unknown[] { return this.cellCache.getErrorMessages(); }

  /**
   * コンストラクタ
   * - GridOptions.onGridReadyを差し替えるため、onGridReadyハンドラはアロー関数で記述してください
   * - ColDef.tooltipValueGetterを差し替えるため、tooltipValueGetterハンドラはアロー関数で記述してください
   * @param options GridOptions
   * @param cellRendererParamsValidatorsPropertyName デフォルト値は'validators' 
   */
  constructor(
    private options: GridOptions,
    private cellRendererParamsValidatorsPropertyName = 'validators') {

    this.options.enableBrowserTooltips = true;
    if (!AppObject.isNullish(options.columnDefs)) {
      this.bindValidation(options.columnDefs);
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const original = this.options.onGridReady;
    this.options.onGridReady = (event) => {
      if (original) {
        original(event);
      }
      this.options.api?.addEventListener('cellEditingStarted', (params: CellEditingStartedEvent) => this.cellEditingStarted(params));
      this.options.api?.addEventListener('virtualRowRemoved', (params: VirtualRowRemovedEvent) => this.virtualRowRemoved(params));
    };
  }
  private bindValidation(colDefs: (ColDef | ColGroupDef)[]) {
    for (const item of colDefs) {
      if (this.isColGroupDef(item)) {
        this.bindValidation(item.children);
        continue;
      }
      if (this.existsValidators(item)) {
        if (!item.cellClassRules?.['app-validate-invalid']) {
          item.cellClassRules = this.getMergedCellClassRules(item, 'app-validate-invalid');
          item.tooltipValueGetter = this.getMergedTooltipValueGetter(item);
        }
      }
    }
  }
  private isColGroupDef(arg: ColDef | ColGroupDef): arg is ColGroupDef {
    return Object.prototype.hasOwnProperty.call(arg, 'children');
  }
  private getMergedCellClassRules(item: ColDef, cssClassName: string): CellClassRules | undefined {
    return Object.assign(
      item.cellClassRules ?? {},
      {
        [cssClassName]: (params: CellClassParams) => {
          return this.isInvalid(params);
        }
      }
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getMergedTooltipValueGetter(item: ColDef): ((params: ITooltipParams) => any) | undefined {
    const original = item.tooltipValueGetter;
    const mergedGetter = (params: ITooltipParams) => {
      if (!AppObject.isNullish(params.node) && !AppObject.isNullish(params.colDef)) {
        const cell = this.cellCache.getCell(params.node, params.colDef);
        if (cell && this.isInvalid(params) && cell.formControl.errors !== null) {
          const errors = cell.formControl.errors;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return Object.keys(errors).map((val) => errors[val])[0].message;
        }
      }
      if (original) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return original(params);
      }
      return undefined;
    };
    return mergedGetter;
  }
  private cellEditingStarted(event: CellEditingStartedEvent) {
    if (!this.existsValidators(event.colDef)) return;

    let cell = this.cellCache.getCell(event.node, event.colDef);
    if (!cell) {
      cell = this.cellCache.createCell(event.node, event.colDef);
    }
    cell.formControl.markAsDirty();
  }
  private virtualRowRemoved(params: VirtualRowRemovedEvent) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (((params.api.getDisplayedRowCount() <= params.rowIndex!) ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      params.api.getDisplayedRowAtIndex(params.rowIndex!) !== params.node)) {
      this.cellCache.deleteRow(params.node);
    }
  }

  /**
   * Grid内にinvalidな内容があるかどうか検証します
   * @returns invalidがあるかどうか
   */
  hasError(): boolean {
    this.markAsDirty();
    const msgs = this.errorMessages;
    if (0 < msgs.length) {
      return true;
    }
    return false;
  }

  /**
   * Validatorのあるすべてのセルを編集した扱いにしてValidationも実施する
   */
  markAsDirty() {
    const validatableColList: Column[] = this.options.columnApi
      ?.getColumns()
      ?.filter((col) => this.existsValidators(col.getColDef()))
      ?? [];
    this.options.api?.forEachLeafNode((row) => {
      for (const col of validatableColList) {
        this.isInvalid({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          api: this.options.api!,
          colDef: col.getColDef(),
          column: col,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          columnApi: this.options.columnApi!,
          context: this.options.context,
          data: row.data,
          node: row,
          rowIndex: row.rowIndex,
          value: this.options.api?.getValue(col, row)
        });
      }
    });
    this.cellCache.markAsDirtyAll();
    this.options.api?.refreshCells();
  }

  private existsValidators(colDef: ColDef | null | undefined): colDef is ColDef {
    if (
      colDef?.field &&
      colDef.cellRendererParams &&
      colDef.cellRendererParams[this.cellRendererParamsValidatorsPropertyName]) {
      return true;
    }
    return false;
  }

  private isInvalid(params: CommonParams): boolean {
    if (!this.existsValidators(params.colDef)) return false;
    if (params.node === undefined) return false;
    let cell = this.cellCache.getCell(params.node, params.colDef);
    if (!cell) {
      cell = this.cellCache.createCell(params.node, params.colDef);
    }
    const colValidators = params.colDef.cellRendererParams[this.cellRendererParamsValidatorsPropertyName] as (ValidatorFn | AppGridValidator)[];
    const actualValidators = colValidators.map(item => {
      if (typeof item !== 'function') {
        return item.func(params);
      }
      return item;
    });
    const ctl = cell.formControl;
    ctl.clearValidators();
    ctl.setValidators(actualValidators);
    ctl.patchValue(params.value);
    return ctl.invalid && (ctl.dirty || ctl.touched);
  }
}

class ReactiveCellCache {
  private state = new Map<IRowNode, Map<ColDef, ReactiveCell>>();

  getErrorMessages(): unknown[] {
    const result: unknown[] = [];
    for (const rowMapPair of this.state) {
      for (const mapCellPair of rowMapPair[1]) {
        const cell = mapCellPair[1];
        if (cell.formControl.invalid) {
          const msgs = this.getErrorMessagesInner(cell.formControl.errors);
          for (const msg of msgs) {
            result.push(msg);
          }
        }
      }
    }
    return result;
  }
  private getErrorMessagesInner(errors: ValidationErrors | null): unknown[] {
    if (!errors) return [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Object.keys(errors).map((val) => errors[val]);
  }

  deleteRow(row: IRowNode) {
    this.state.delete(row);
  }

  getColDefMap(row: IRowNode): Map<ColDef, ReactiveCell> | undefined {
    return this.state.get(row);
  }

  getCell(row: IRowNode, col: ColDef): ReactiveCell | undefined {
    if (this.state.get(row)) {
      return this.state.get(row)?.get(col);
    }
    return undefined;
  }

  createCell(row: IRowNode, colDef: ColDef) {
    let colDefMap = this.state.get(row);
    if (!colDefMap) {
      colDefMap = new Map<ColDef, ReactiveCell>();
      this.state.set(row, colDefMap);
    }
    let cell = colDefMap.get(colDef);
    if (!cell) {
      cell = { formControl: new FormControl() };
      colDefMap.set(colDef, cell);
    }
    return cell;
  }

  markAsDirtyAll() {
    this.state.forEach(row => row.forEach(cell => cell.formControl.markAsDirty()));
  }
}