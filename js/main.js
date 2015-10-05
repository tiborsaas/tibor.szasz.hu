
window.addEventListener('DOMContentLoaded', function () {
	echo.init({
		offset: 666,
		throttle: 250,
		unload: false,
		callback: function (element, op) {
			if(element.classList.contains('loadBackground')){
				document.querySelector('footer').classList.add('loadBackground');
			}
		}
	});
});
