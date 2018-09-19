require('babel-core/register.js')({
	'plugins': [
		require('babel-plugin-transform-es2015-modules-commonjs')
	]
});

let del = require('del');
let gulp = require('gulp');
let babel = require('gulp-babel');
let jasmine = require('gulp-jasmine');

let copy = gulp.parallel(copy_metafile, copy_readme);

let build = gulp.series(
	clean,
	gulp.parallel(
		build_js,
		copy
	)
);
exports.build = build;

function copy_readme() {
	return gulp
		.src('./README.md')
		.pipe(gulp.dest('./dist'));
}

function copy_metafile() {
	return gulp
		.src('./package.json')
		.pipe(gulp.dest('./dist'));
}

function build_js() {
	return gulp
		.src('./src/**/!(*Spec).js')
		.pipe(babel({
			moduleIds: true,
			presets: [],
			plugins: ['transform-es2015-modules-commonjs']
		}))
		.pipe(gulp.dest('./dist'));
}

function clean() {
	return del('./dist');
}

exports.test = test;
function test() {
	global.$Debug = true;

	return gulp
		.src('./src/**//*Spec.js')
		.pipe(jasmine({includeStackTrace: true}));
}

exports.dev = dev;
function dev() {
	return gulp.watch(['./src/**/*.js'], test);
}
