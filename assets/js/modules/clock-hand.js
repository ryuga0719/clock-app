import * as THREE from "three";
import Utility from "./utils/utility";
import Time from "./time";

// 時計の針関連
export default class ClockHand {
  constructor() {}

  createClockHand(length, name, radius, color = 0xff0000) {
    const radiusTop = radius; // 針の先端の半径
    const radiusBottom = radius; // 針の根本の半径
    const height = length; // 針の長さ

    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      32
    );
    const material = new THREE.MeshBasicMaterial({ color: color });
    const clockHandMesh = new THREE.Mesh(geometry, material);

    // 針の位置を調整して (0, 0, 0) に配置
    clockHandMesh.position.set(0, height / 2, 0);

    const clockHand = new THREE.Object3D();
    clockHand.add(clockHandMesh);
    clockHand.rotation.z = Math.PI / 2;
    clockHand.name = name;

    return clockHand;
  }

  // 時針の初期位置を計算
  calculateHourHandPosition(hour, minute) {
    // 1時間あたりの角度（ラジアン）
    const degreesPerHour = 360 / 12;

    // 時針の位置を計算し、分の影響も考慮してラジアンに変換
    const hourHandPosition =
      ((hour % 12) * degreesPerHour + (minute / 60) * degreesPerHour) *
      (Math.PI / 180);

    return hourHandPosition;
  }

  // 分針、秒針の初期位置を計算
  calculateMinuteSecondHandPosition(minutes) {
    // 1分あたりの角度（ラジアン）
    const degreesPerMinute = 360 / 60;

    // 分針の位置を計算し、ラジアンに変換
    const minuteHandPosition =
      (minutes % 60) * degreesPerMinute * (Math.PI / 180);

    return minuteHandPosition;
  }

  // 分針が1秒間に進む回転角
  calculateMinuteRotationPerSecond() {
    // 1分あたりの角度（ラジアン）
    const degreesPerMinute = 360 / 60;

    // 分針の1秒間の回転角をラジアンで計算
    return (degreesPerMinute / 60) * (Math.PI / 180); // 60秒で1分
  }

  // 時針が1秒間に進む回転角
  calculateHourRotationPerSecond() {
    // 1時間あたりの角度（ラジアン）
    const degreesPerHour = 360 / 12;

    // 時針の1秒間の回転角をラジアンで計算
    return (degreesPerHour / 3600) * (Math.PI / 180); // 3600秒で1時間
  }
}
