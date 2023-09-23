import * as THREE from "three";
import Utility from "./utils/utility";

export default class Object {
  constructor(_scene) {
    this.scene = _scene;

    this.createCenterObject(); // 中心点作成
    this.createParticles(); // パーティクル生成
  }

  // 中心のオブジェクト作成
  createCenterObject() {
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);
    this.scene.add(sphere);
  }

  createParticles() {
    // 形状データを作成
    const SIZE = 1000;
    // 配置する個数
    const LENGTH = 10000;
    // 頂点情報を格納する配列
    const vertices = [];
    for (let i = 0; i < LENGTH; i++) {
      const x = SIZE * (Math.random() - 0.5);
      const y = SIZE * (Math.random() - 0.5);
      const z = SIZE * (Math.random() - 0.5);

      vertices.push(x, y, z);
    }

    // 形状データを作成
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    // マテリアルを作成
    const material = new THREE.PointsMaterial({
      // 一つ一つのサイズ
      size: 0.5,
      // 色
      color: 0xffffff,
    });

    // 物体を作成
    const mesh = new THREE.Points(geometry, material);
    this.scene.add(mesh);
  }

  /**
   * キューブを円周上に配置する
   *
   * @param {*} numCubes - キューブの数
   * @param {*} radius - 半径
   * @param {*} deltaY - Yの変異
   * @memberof Base
   */
  arrangeObjectsInCircle(
    numCubes,
    radius,
    randomMin,
    randomMax,
    group,
    deltaSize = false
  ) {
    for (let i = 0; i < numCubes; i++) {
      const angle = (Math.PI * 2 * i) / numCubes; // 円周上の角度
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      let geometry;
      if (deltaSize && i % 3 == 0) {
        geometry = new THREE.SphereGeometry(1);
      } else {
        geometry = new THREE.SphereGeometry(0.3);
      }
      const material = new THREE.MeshNormalMaterial();
      const cube = new THREE.Mesh(geometry, material);
      const delta = Utility.getRandomInt(randomMin, randomMax);
      cube.position.set(x, delta, z);
      group.add(cube);
    }
  }
}
