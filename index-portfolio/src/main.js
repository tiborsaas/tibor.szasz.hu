"use strict";

import Modal from "./modal.js";
import GlslCanvas from "./glslcanvas.min";
import texture1Path from "../img/shader/texture_1.jpg";
import bayer8x8Path from "../img/shader/8x8-bayer.png";
import ModalData from "./data/projects.json";
import HeroShader from "./shaders/hero.glsl";
import MetaballShader from "./shaders/metaballs.glsl";

class UI {
  constructor() {
    this.modal = new Modal(ModalData);
    this.canvas = null;

    this.initHeroShader();
    this.initMetaballs();

    document.querySelector(".show-more").addEventListener("click", (e) => {
      document.querySelector(".about.slide").scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  initHeroShader() {
    const heroCanvas = document.querySelector(".hero canvas");
    this.canvas = heroCanvas;
    this.maximizeHeroCanvasSize(heroCanvas);

    const shader = new GlslCanvas(this.canvas);
    shader.uniformTexture("u_tex0", texture1Path, {
      repeat: true,
      filtering: "mipmap",
    });
    shader.uniformTexture("u_tex1", bayer8x8Path);
    shader.load(HeroShader);

    window.addEventListener("resize", (e) => {
      this.maximizeHeroCanvasSize(heroCanvas);
    });
  }

  initMetaballs() {
    const metaballsCanvas = document.querySelector(".about canvas");
    metaballsCanvas.width = 500;
    metaballsCanvas.height = 400;

    const shader = new GlslCanvas(metaballsCanvas);
    shader.load(MetaballShader);
    shader.uniformTexture("u_tex0", bayer8x8Path);
  }

  maximizeHeroCanvasSize(canvas) {
    canvas.style.width = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = window.innerHeight;
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  const Portfolio = new UI();
});
