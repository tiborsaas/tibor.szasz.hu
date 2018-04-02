'use strict';

class UI {
	constructor() {
		this.canvas = null;
		this.shader = null;

		this.initShader();
	}

	initShader() {
		const canvas = document.querySelector('canvas');
			canvas.style.width = '100%';
			canvas.width  = canvas.offsetWidth;
			canvas.height = window.innerHeight;

		this.canvas = canvas;

		const shader = new GlslCanvas(this.canvas);
			shader.uniformTexture('u_tex0', 'img/shader/texture.jpg',{
				repeat: true
			});
			shader.uniformTexture('u_tex1', 'img/shader/8x8-bayer.png',{
				repeat: true
			});

		this.shader = shader;
	}
}

document.addEventListener('DOMContentLoaded', event => {
	const Portfolio = new UI;
	console.log(Portfolio)
});
