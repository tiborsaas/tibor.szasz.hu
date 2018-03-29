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
		this.shader = new GlslCanvas(this.canvas);
	}
}

document.addEventListener('DOMContentLoaded', event => {
	const Portfolio = new UI;
	console.log(Portfolio)
});
