import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class Base {
  scene;
  renderer;
  camera;
  canvasElement;

  constructor() {
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

    // 立方体の作成と配置
    this.arrangeObjectsInCircle(60, 10);

    // 立方体の作成
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial({ color: 0x00ffff });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);

    // 初期化関数呼び出し
    this.init();

    this.resizeHandler();
  }

  init() {
    // アニメーションループ
    const animate = () => {
      requestAnimationFrame(animate);

      // 立方体をランダムに回転
      this.cube.rotation.x += Math.random() * 0.1;
      this.cube.rotation.y += Math.random() * 0.1;
      this.cube.rotation.z += Math.random() * 0.1;

      // レンダリング
      this.renderer.render(this.scene, this.camera);
    };

    animate();
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

  // 円形にオブジェクトを配置
  arrangeObjectsInCircle(numCubes, radius) {
    for (let i = 0; i < numCubes; i++) {
      const angle = (Math.PI * 2 * i) / numCubes; // 円周上の角度
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshNormalMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x, 0, z);
      this.scene.add(cube);
    }
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

    const controls = new OrbitControls(this.camera, this.canvasElement);
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
