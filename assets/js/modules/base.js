import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import ClockHand from "./clock-hand";
import Utility from "./utils/utility";
import Time from "./time";

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

    this.now = {
      hour: this.timeObj.getJapaneseTime().hour,
      minute: this.timeObj.getJapaneseTime().minute,
      second: this.timeObj.getJapaneseTime().second,
    };

    this.clockHand = new ClockHand(); // 時計の針

    // レンダラーの設定
    this.setRenderer();

    // シーンの作成
    this.scene = new THREE.Scene();

    // カメラの設定
    this.setCamera();

    // 軸表示
    this.setAxis();

    // 光源表示
    this.setLight();

    // グループの作成
    this.minutesGroup = Utility.createAndAddGroup(this.scene, null);
    this.timeGroup = Utility.createAndAddGroup(this.scene, null);

    // 立方体の作成と配置
    this.arrangeObjectsInCircle(60, 10, -3, 3, this.minutesGroup); // 秒・分
    this.arrangeObjectsInCircle(12, 20, -5, 5, this.timeGroup); // 時

    // 時計の針を追加
    this.initClockHands();

    // 中心の立方体の作成
    this.createCenterObject();

    // 初期化関数呼び出し
    this.init();

    this.resizeHandler();
  }

  // 針の初期化
  initClockHands() {
    this.scene.add(this.clockHand.createClockHand(12, "timeHand", 0.1)); // 時針
    this.scene.add(
      this.clockHand.createClockHand(18, "minuteHand", 0.05, 0xff00ff)
    ); // 分針
    this.scene.add(
      this.clockHand.createClockHand(16, "secondHand", 0.03, 0x00ff00)
    ); // 秒針

    const hourHandPosition = this.clockHand.calculateHourHandPosition(
      this.now.hour
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
    // アニメーションループ
    // const animate = () => {
    //   requestAnimationFrame(animate);
    //   // this.minutesGroup.rotation.y += 0.01;

    //   this.scene.getObjectByName("secondHand").rotation.y -= 0.03; // 秒針
    //   // this.scene.getObjectByName("minuteHand").rotation.y -= 0.02; // 秒針
    //   // this.scene.getObjectByName("timeHand").rotation.y -= 0.01; // 分針

    //   // レンダリング
    //   this.renderer.render(this.scene, this.camera);
    // };

    // animate();
    const update = (callback) => {
      if ((Math.round(callback / 10) * 10) % 1000 == 0) {
        //処理
        this.scene.getObjectByName("secondHand").rotation.y -=
          Utility.degree2Radian(360 / 60);
      }

      requestAnimationFrame(update);
      this.renderer.render(this.scene, this.camera);
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

  /**
   * キューブを円周上に配置する
   *
   * @param {*} numCubes - キューブの数
   * @param {*} radius - 半径
   * @param {*} deltaY - Yの変異
   * @memberof Base
   */
  arrangeObjectsInCircle(numCubes, radius, randomMin, randomMax, group) {
    for (let i = 0; i < numCubes; i++) {
      const angle = (Math.PI * 2 * i) / numCubes; // 円周上の角度
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshNormalMaterial();
      const cube = new THREE.Mesh(geometry, material);
      const delta = Utility.getRandomInt(randomMin, randomMax);
      cube.position.set(x, delta, z);
      group.add(cube);
    }
  }

  // 中心のオブジェクト作成
  createCenterObject() {
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    this.scene.add(sphere);
  }

  // レンダラー設定
  setRenderer() {
    this.canvasElement = document.querySelector("#canvas");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 軸設定
  setAxis() {
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
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

  // 光源設定
  setLight() {
    const lightPositions = [-5, 0, 5];
    const sphereSize = 0.05;

    // ライトマップの設定
    for (let x of lightPositions) {
      for (let y of lightPositions) {
        for (let z of lightPositions) {
          const pointLight = new THREE.PointLight(0xffffff, 2, 50, 1.0);
          pointLight.position.set(x, y, z);
          this.scene.add(pointLight);

          const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
          );
          this.scene.add(pointLightHelper);
        }
      }
    }
  }
}
