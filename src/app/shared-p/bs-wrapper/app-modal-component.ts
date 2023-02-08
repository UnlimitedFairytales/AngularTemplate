// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AppModalResult<TResultData> = { isCanceled: boolean; resultData?: TResultData; }

export type AppModalDoneFunc<TResultData> = (result: AppModalResult<TResultData>) => void; // Promise<AppModalResult<TResultData>>'s resolve

export interface AppModalComponent<TInitialData, TResultData> {
  initialData?: TInitialData;
  done?: AppModalDoneFunc<TResultData>;
}