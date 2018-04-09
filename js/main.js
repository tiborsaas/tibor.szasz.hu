'use strict';

// @todo Load polyfill for IntersectionObserver

class UI {
	constructor() {
		this.canvas = null;
		this.shader = null;

		this.initShader();
		this.initAnimationEvents();
		this.initMetaballs();
	}

	initShader() {
		const heroCanvas = document.querySelector('.hero canvas');
			heroCanvas.style.width = '100%';
			heroCanvas.width  = heroCanvas.offsetWidth;
			heroCanvas.height = window.innerHeight;

		this.canvas = heroCanvas;

		const shader = new GlslCanvas(this.canvas);
			shader.uniformTexture('u_tex0', 'img/shader/texture_1.jpg',{
				repeat: true,
				filtering: 'mipmap'
			});
			shader.uniformTexture('u_tex1', 'img/shader/8x8-bayer.png');

		this.shader = shader;
	}

	initMetaballs() {
		const metaballsCanvas = document.querySelector('.about canvas');
			metaballsCanvas.width = 500;
			metaballsCanvas.height = 400;

		const shader = new GlslCanvas(metaballsCanvas);
			shader.uniformTexture('u_tex0', 'img/shader/8x8-bayer.png');
	}

	initAnimationEvents() {
		const myImgs = document.querySelectorAll('.animate');

		const observer = new IntersectionObserver(entries => {
		  entries.forEach(entry => {
			if (entry.intersectionRatio > 0) {
			  console.log('in the view', entry.intersectionRatio);
			} else {
			  console.log('out of view');
			}
		  });
		});

		myImgs.forEach(image => {
		  observer.observe(image);
		});
	}
}

document.addEventListener('DOMContentLoaded', event => {
	const Portfolio = new UI;
	console.log(Portfolio)
});
