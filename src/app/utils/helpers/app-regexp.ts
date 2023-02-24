export class AppRegExp {
  /**
   * 様々な定型パターン
   */
  static patterns = {
    INTEGER: '^((-)?([1-9][0-9]*)||([0-9]))$',
    WORD: '^[A-Za-z0-9_]*$',
    KATA: '^([ﾞﾟｱ-ﾝｦァ-ンヰヱヴー\u002D])*$',
    HIRA: '^([ぁ-んゐゑー])*$',
    WORD_SPACE: '^[A-Za-z0-9_ ]*$',
    KATA_SPACE: '^([ﾞﾟｱ-ﾝｦァ-ンヰヱヴー 　\u002D])*$',
    HIRA_SPACE: '^([ぁ-んゐゑー 　\u002D])*$',
  } as const;
}