import { trigger, transition, style, query, group, animate, animateChild, AnimationMetadata, state } from '@angular/animations';

function optionalQuery(selector: string, animation: AnimationMetadata | AnimationMetadata[]) {
  return query(selector, animation, { optional: true });
}

/**
 * Angular Animation  
 * https://angular.jp/guide/animations  
 * https://angular.jp/guide/transition-and-triggers
 * 
 * 1. state()は状態を表します
 *     - 第1引数は状態名
 *     - 第2引数はstyle
 *     - 開始と終了はvoid。本来のstyleの内容
 *     - styleにおいて、「*」は本来のstyleの内容
 * 2. transition()は状態遷移を表します
 *     - 第1引数は状態遷移
 *     - 第2引数はアニメーション内容
 *     - 要求に対応するtransitionがない場合、即座に次のstateになります
 *     - 要求に対応するtransitionが複数ある場合、先に定義したtransitionが実施されます
 *     - 状態遷移において、「*」はワイルドカード、「:enter」は「void => *」、「:leave」は「void => *」
 * 3. trigger()は状態遷移図全体を表します
 *     - html側に[@trrigerName]で紐づけます
 * 4. group()は並行して実施したいアニメーションをまとめます
 * 5. query()はアニメーションを適用する内容や条件を絞り込みます
 *     - queryする際、{ optional: true }は実質必須
 *     - queryする際、「@トリガー名」「@*」で子要素以下に紐づいたトリガーを指定でき、animateChild()と併せて使用します
 *     - queryする際、「:enter」「:leave」を指定でき、router-outletの親要素に指定するアニメーションを作る際に使用します
 * 6. DOM側に複数のtriggerが紐づけられている時、奇妙な挙動になります
 *     - デフォルト時
 *         - 親要素のアニメーションだけ、再生されます
 *         - 親要素のアニメーションの最中、子要素は本来のstyleの内容が表示されます
 *         - 親要素のアニメーションが終わると、子要素は即座に新しいstateの表示になります
 *     - animateChild()が含まれている場合
 *         - 親要素を操作するqueryの前に記述された場合、子アニメーションの再生が完了してから親アニメーションが開始されます
 *         - group()で並列に配置された場合、並列にアニメーションが実施されます
 *         - 親要素を操作するqueryの後に記述された場合、親アニメーション終了後に子アニメーションが再生されます
 *         - いずれの場合も、子要素は現在のstateが適用された状態の表示からの遷移になるため、「本来のstyleの内容」が表示されてしまうことを防げます
 * 7. animateChild()中に再transitionが発生すると、不具合になります
 *     - 表示とstateの不一致が起きます
 *     - 表示とstateの不一致が起きている状態からアニメーションする場合、不適切に再生されます
 *     - 不適切な再生中にさらに再transitionしても、不適切なままになります
 * 8. 親子関係やanimationChild周りの不具合が多数あるため、複雑な使い方は避けてください
 *     - router-outlet用の遷移アニメーションと、部品に適用するアニメーションの併用は避けたほうが無難です
 */
export class AppAnimations {

  /**
   * 典型的なFloatIn
   * 
   * このアニメーションは:enter, :leaveを同時に同じ位置を基準に存在させます  
   * すなわち、対象の要素はアニメーション中{ position: 'absolute', top: 0, left: 0, width: '100%' }されます
   * 
   * @param triggerName 
   * @param enterStart 新しい状態の横初期位置
   * @param leaveDuration 古い状態が消えるまでの動作時間
   * @param enterDelay 新しい状態の動作開始までのディレイ
   * @param enterDuration 新しい状態のディレイ後の動作時間
   * @returns 
   */
  static floatIn(triggerName: string, enterStart = '-1%', leaveDuration = '100ms', enterDelay = '100ms', enterDuration = '300ms') {
    return trigger(triggerName, [
      transition('* <=> *', [
        style({ position: 'relative' }),
        optionalQuery(':enter, :leave', [style({ position: 'absolute', top: 0, left: 0, width: '100%' })]),
        optionalQuery(':enter', [style({ left: enterStart, opacity: 0 })]),
        group([
          optionalQuery(':leave', [animate(`${leaveDuration} ease-out`, style({ opacity: 0 }))]),
          optionalQuery(':enter', [animate(`${enterDuration} ${enterDelay} ease-out`, style({ left: '0%', opacity: 1 }))]),
        ]),
        optionalQuery('@*', animateChild()),
      ])
    ]);
  }

  /**
   * 典型的なOpenClose。状態：open, closed
   * 
   * Angular14以降、このアニメーションを実施するとConsoleに警告が出ます。  
   * （'pointer-events'やoverflowの指定は一般的だが、警告が出てしまう）  
   * 詳細は以下のissueを確認してください。  
   * https://github.com/angular/angular/issues/46928  
   * @param triggerName 
   * @param duration 動作時間
   * @param ease '', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(x1, y1, x2, y2)'
   * @param enterDuration animateChild()で:enterする際の挙動対策。短い時間を設定することで問題を発生させづらくする
   * @returns 
   */
  static openClose(triggerName = 'openClose', duration = '300ms', ease = 'ease', enterDuration = '100ms') {
    return trigger(triggerName, [
      state('open', style({ height: '*', opacity: 1 })),
      state('closed', style({ height: '0px', opacity: 0, 'pointer-events': 'none', padding: 0, overflow: 'hidden' })),
      transition(':enter', [animate(`${enterDuration} ${ease}`)]),
      transition('* <=> *', [animate(`${duration} ${ease}`)]),
    ]);
  }
}