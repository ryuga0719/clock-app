import * as THREE from "three";

export default class Utility {
  constructor() {}

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static createAndAddGroup(scene, parentGroup) {
    const group = new THREE.Group();
    if (parentGroup) {
      parentGroup.add(group);
    } else {
      scene.add(group);
    }
    return group;
  }

  /**
   * 度数 → ラジアンに変換
   * @param {number} val - 度数
   * @return {number} ラジアン
   */
  static degree2Radian = (val) => {
    return (val * Math.PI) / 180;
  };

  /**
   * ラジアン → 度数に変換
   * @param {number} val - ラジアン
   * @return {number} 度数
   */
  static radian2Degree = (val) => {
    return (val * 180) / Math.PI;
  };
}
