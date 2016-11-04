require('babel-core/register.js')({
	'plugins': 'transform-es2015-modules-commonjs'
});

let del = require('del');
let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let babel = require('gulp-babel');
let jasmine = require('gulp-jasmine');

exports.build = gulp.series(
	clean,
	gulp.parallel(
		copy,
		build_js
	)
);

function build_js() {
	return gulp
		.src('./src/**/!(*Spec).js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			moduleIds: true,
			plugins: ['transform-es2015-modules-commonjs']
		}))
		.pipe(gulp.dest('./dist'));
}

function copy() {
	return gulp
		.src(['./package.json', './LICENSE', './README.md'])
		.pipe(gulp.dest('./dist'));
}

function clean() {
	return del('./dist');
}

exports.test = test;
function test() {
	return gulp
		.src('./src/**/*Spec.js')
		.pipe(jasmine());
}

exports.dev = dev;
function dev() {
	return gulp.watch(['./src/**/*.js'], test);
}
