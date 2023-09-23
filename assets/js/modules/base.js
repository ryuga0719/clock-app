import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import ClockHand from "./clock-hand";
import Utility from "./utils/utility";
import Time from "./time";
import Axis from "./axis";
import ObjectLight from "./object-light";
import Object from "./object";

export default class Base {
  scene;
  renderer;
  camera;
  canvasElement;
  minutesGroup;
  timeGroup;

  constructor() {
    // 時間設定
    this.timeObj = new Time();

    // 現在時刻
    this.now = {
      hour: this.timeObj.getJapaneseTime().hour,
      minute: this.timeObj.getJapaneseTime().minute,
      second: this.timeObj.getJapaneseTime().second,
    };

    // 時計の針
    this.clockHand = new ClockHand();

    // レンダラーの設定
    this.setRenderer();

    // シーンの作成
    this.scene = new THREE.Scene();

    // カメラの設定
    this.setCamera();

    // 軸表示
    // new Axis(this.scene);

    // 光源表示
    new ObjectLight(this.scene);

    // グループの作成
    this.minutesGroup = Utility.createAndAddGroup(this.scene, null);
    this.timeGroup = Utility.createAndAddGroup(this.scene, null);

    // オブジェクトの作成
    const object = new Object(this.scene);
    object.arrangeObjectsInCircle(60, 10, -5, 5, this.minutesGroup); // 秒・分
    object.arrangeObjectsInCircle(12, 18, 0, 0, this.timeGroup, true); // 時

    // 時計の針を追加
    this.initClockHands();

    // 初期化関数呼び出し
    this.init();

    this.resizeHandler();
  }

  // 針の初期化
  initClockHands() {
    this.scene.add(this.clockHand.createClockHand(12, "timeHand", 0.2)); // 時針
    this.scene.add(
      this.clockHand.createClockHand(18, "minuteHand", 0.1, 0x0000ff)
    ); // 分針
    this.scene.add(
      this.clockHand.createClockHand(15, "secondHand", 0.03, 0x00ff00)
    ); // 秒針

    const hourHandPosition = this.clockHand.calculateHourHandPosition(
      this.now.hour,
      this.now.minute
    );
    const minuteHandPosition = this.clockHand.calculateMinuteSecondHandPosition(
      this.now.minute
    );
    const secondHandPosition = this.clockHand.calculateMinuteSecondHandPosition(
      this.now.second
    );

    // 針の初期位置を設定
    this.scene.getObjectByName("secondHand").rotation.y -= secondHandPosition;
    this.scene.getObjectByName("minuteHand").rotation.y -= minuteHandPosition;
    this.scene.getObjectByName("timeHand").rotation.y -= hourHandPosition;
  }

  init() {
    const deltaPerSecond = Utility.degree2Radian(360 / 60);
    const minuteRotationPerSecond =
      this.clockHand.calculateMinuteRotationPerSecond();
    const hourRotationPerSecond =
      this.clockHand.calculateHourRotationPerSecond();

    let lastTimestamp = null;

    const update = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const elapsedMilliseconds = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // 更新間隔ごとに回転角を更新
      const secondsElapsed = elapsedMilliseconds / 1000;
      const deltaRotation = deltaPerSecond * secondsElapsed;
      const minuteDeltaRotation = minuteRotationPerSecond * secondsElapsed;
      const hourDeltaRotation = hourRotationPerSecond * secondsElapsed;

      // 回転角を反映
      this.scene.getObjectByName("secondHand").rotation.y -= deltaRotation;
      this.scene.getObjectByName("minuteHand").rotation.y -=
        minuteDeltaRotation;
      this.scene.getObjectByName("timeHand").rotation.y -= hourDeltaRotation;

      // レンダラの更新
      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  // リサイズ処理
  resizeHandler() {
    window.addEventListener("resize", () => {
      // サイズを取得
      const width = window.innerWidth;
      const height = window.innerHeight;

      // レンダラーのサイズを調整する
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(width, height);

      // カメラのアスペクト比を正す
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
  }

  // レンダラー設定
  setRenderer() {
    this.canvasElement = document.querySelector("#canvas");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // カメラ設定
  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(7, 7, 7);

    new OrbitControls(this.camera, this.canvasElement);
  }
}
