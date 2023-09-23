export default class Time {
  now; // 現在時刻
  constructor() {
    this.hour = this.getJapaneseTime().hour; // 時
    this.minute = this.getJapaneseTime().minute; // 分
    this.second = this.getJapaneseTime().second; // 秒

    console.log(this.hour, this.minute, this.second);
  }

  getJapaneseTime() {
    const japanTime = new Date();

    // 日本時間の時、分、秒を取得
    const hour = japanTime.getHours(); // 時
    const minute = japanTime.getMinutes(); // 分
    const second = japanTime.getSeconds(); // 秒

    return {
      hour: hour,
      minute: minute,
      second: second,
    };
  }
}
