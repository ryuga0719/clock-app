import * as THREE from "three";
import Utility from "./utils/utility";

// 時計の針関連
export default class ClockHand {
  constructor() {}

  createClockHand(length, name, radius) {
    const radiusTop = radius; // 針の先端の半径
    const radiusBottom = radius; // 針の根本の半径
    const height = length; // 針の長さ

    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      32
    );
    const material = new THREE.MeshNormalMaterial();
    const clockHandMesh = new THREE.Mesh(geometry, material);

    // 針の位置を調整して (0, 0, 0) に配置
    clockHandMesh.position.set(0, height / 2, 0);

    const clockHand = new THREE.Object3D();
    clockHand.add(clockHandMesh);
    clockHand.rotation.z = Math.PI / 2;
    clockHand.name = name;

    return clockHand;
  }
}
