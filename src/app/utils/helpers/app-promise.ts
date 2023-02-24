export class AppPromise {
  /**
   * 非同期の待機
   * @param delay_ms 待機時間
   * @returns (awaitable) void
   */
  static delay(delay_ms: number): Promise<void> {
    console.log(`delay ${delay_ms}`);
    return new Promise((resolve) => setTimeout(resolve, delay_ms));
  }
}