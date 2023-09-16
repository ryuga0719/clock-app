import "reset-css";
import "../scss/main.scss";

import Base from "./modules/base";

class Main {
  constructor() {}

  init = () => {
    console.log("init");
    const baseModule = new Base();
  };
}

document.addEventListener("DOMContentLoaded", (event) => {
  const main = new Main();
  main.init();
});
