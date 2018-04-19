/**
 * GULP tasks
 * @author Tibor Szász
 */
const fs = require('fs'),
	gulp = require('gulp'),
	sass = require('gulp-sass');
	uglify = require('gulp-uglifyes');
	concat = require('gulp-concat');
	autoprefixer = require('gulp-autoprefixer');

/**
 * Launch static server
 */
gulp.task('express', function() {
	const express = require('express');
	const app = express();
	app.use(express.static(__dirname));
	app.listen(4000);
});

/**
 * Compile sass files to the /dist folder
 */
gulp.task('sass', function () {
	gulp.src('./sass/**/*.scss')
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
	.pipe(gulp.dest('./dist'));
});

/**
 * Compile JS files
 */
gulp.task('js:dev', function () {
	gulp.src('./js/*.js')
	.pipe(uglify())
	.pipe(concat('flat.js'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
	gulp.src('./js/*.js')
	.pipe(uglify())
	.pipe(concat('flat.js'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('publish', ['sass','js'], function() {
	console.log('Assets generated');
});

gulp.task('build', ['sass','js'], function() {
	console.log('=== Build done ===');
});

/**
 * And the main entry point:
 *  - compiles sass
 *  - watches sass
 */
gulp.task('default', ['express','sass','js'], function() {

	console.log('Serving things on http://localhost:4000');

	// Peek for changes
	gulp.watch('./sass/**/*.scss', ['sass']);
	gulp.watch('./js/**/*.js', ['js']);
});

