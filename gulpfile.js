require('babel-core/register.js');

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var eslint = require('gulp-eslint');
var path = require('path');
var jasmine = require('gulp-jasmine');

// build module
gulp.task('build', function() {
	return (
		gulp.src('./src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			moduleIds: true,
			presets: ['es2015-loose'],
			plugins: ['transform-es2015-modules-commonjs', 'external-helpers-2']
		}))
		.pipe(gulp.dest('./dist'))
	);
});

//run test
gulp.task('test', () => {
	return (
		gulp.src('./test/*.js')
			.pipe(jasmine())
	);
});

// -------------------------------------PRIVATE HELPER TASKS
gulp.task('dev', function() {
	gulp.watch(['./src/**/*.js', './src/*.js', './test/*.js'], ['test']);
});
