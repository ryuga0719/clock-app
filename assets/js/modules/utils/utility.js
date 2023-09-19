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
}
