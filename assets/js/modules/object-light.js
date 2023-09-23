import * as THREE from "three";

// ライト関連
export default class ObjectLight {
  constructor(_scene) {
    this.scene = _scene;

    this.setLight();
  }

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

          // const pointLightHelper = new THREE.PointLightHelper(
          //   pointLight,
          //   sphereSize
          // );
          // this.scene.add(pointLightHelper);
        }
      }
    }
  }
}
