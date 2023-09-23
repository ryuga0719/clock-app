import * as THREE from "three";

// 軸関連モジュール
export default class Axis {
  constructor(_scene) {
    this.scene = _scene;

    this.setAxis();
  }

  // 軸のセット
  setAxis() {
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }
}
