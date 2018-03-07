"use strict";

const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');

const build = gulp.series(
	clean,
	gulp.parallel(
		compile,
		copyMetadata
	)
);
build.displayName = 'build';

copyMetadata.displayName = 'copy:metadata';
function copyMetadata() {
	return gulp
		.src(['./LICENSE', './package.json', './README.md'])
		.pipe(gulp.dest('./dist'));
}

function compile() {
	return gulp
		.src('./src/*.js')
		.pipe(babel({
			plugins: [
				'transform-es2015-modules-commonjs'
			]
		}))
		.pipe(gulp.dest('./dist'));
}

function clean(done) {
	del('./dist').then(() => done()).catch(done);
}

exports.default = build;
