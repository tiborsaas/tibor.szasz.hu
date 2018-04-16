'use strict';

class UI {
	constructor() {
		this.modal = null;
		this.canvas = null;
		this.shader = null;
		this.currentScroll = [0, 0];

		this.initHeroShader();
		this.initMetaballs();
		this.initModal();
	}

	initHeroShader() {
		const heroCanvas = document.querySelector('.hero canvas');
		this.canvas = heroCanvas;
		this.maximizeHeroCanvasSize(heroCanvas);

		const shader = new GlslCanvas(this.canvas);
			shader.uniformTexture('u_tex0', 'img/shader/texture_1.jpg',{
				repeat: true,
				filtering: 'mipmap'
			});
			shader.uniformTexture('u_tex1', 'img/shader/8x8-bayer.png');

		this.shader = shader;

		window.addEventListener('resize', e => {
			this.maximizeHeroCanvasSize(heroCanvas);
		});
	}

	initMetaballs() {
		const metaballsCanvas = document.querySelector('.about canvas');
			metaballsCanvas.width = 500;
			metaballsCanvas.height = 400;

		const shader = new GlslCanvas(metaballsCanvas);
			shader.uniformTexture('u_tex0', 'img/shader/8x8-bayer.png');
	}

	maximizeHeroCanvasSize(canvas) {
		canvas.style.width = '100%';
		canvas.width  = canvas.offsetWidth;
		canvas.height = window.innerHeight;
	}

	initModal() {
		fetch('data/projects.json')
		.then( response => response.json())
		.then( projects => {
			this.modal = new Modal( projects );
		});
	}
}

document.addEventListener('DOMContentLoaded', event => {
	const Portfolio = new UI;
	console.log(Portfolio)
});
