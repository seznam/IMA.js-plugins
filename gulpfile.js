require('babel-core/register.js')({
	'plugins': require('babel-plugin-transform-es2015-modules-commonjs')
});

let del = require('del');
let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let babel = require('gulp-babel');
let jasmine = require('gulp-jasmine');
let jsdoc = require('gulp-jsdoc3');
let change = require('gulp-change');

exports.build = gulp.series(
	clean,
	gulp.parallel(
		copy,
		build
	)
);
exports.test = test;
exports.dev = dev;
exports.doc = gulp.series(clearDoc, preprocessDoc, generateDoc, cleanUpDoc);

function build() {
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
		.src(['./package.json', 'README.md', 'LICENSE'])
		.pipe(gulp.dest('./dist'));
}

function test() {
	global.$Debug = true;
	return gulp
		.src('./src/**/*Spec.js')
		.pipe(jasmine({ includeStackTrace: false }))
		.on('error', function() {
			this.emit('end');
		});
}

function dev() {
	return gulp.watch(['./src/**/*.js'], gulp.series(test));
}

function cleanUpDoc() {
	return del('./doc-src');
}

function generateDoc(done) {
	// Unfortunately, JSDoc invokes the callback for every file. Because of
	// this, we have to handle the done callback invocation in a little
	// bit more complicated way
	const COMPLETION_TIMEOUT = 1000; // milliseconds
	let completionTimeout = null;

	gulp
		.src(['README.md', './doc-src/**/*'], { read: false })
		.pipe(jsdoc({
			opts: {
				destination: './doc',
				template: './node_modules/docdash/'
			}
		}, () => {
			if (completionTimeout) {
				clearTimeout(completionTimeout);
			}
			completionTimeout = setTimeout(done, COMPLETION_TIMEOUT);
		}));
}

function preprocessDoc() {
	return gulp
		.src('./src/**/!(*Spec).js')
		.pipe(change((content) => {
			let oldContent = null;

			while (content !== oldContent) {
				oldContent = content;
				for (let preprocessor of documentationPreprocessors) {
					let { pattern, replace } = preprocessor;
					content = content.replace(pattern, replace);
				}
			}

			return `/** @module */\n${content}`;
		}))
		.pipe(gulp.dest('./doc-src'));
}

function clearDoc() {
	return del(['./doc-src', './doc']);
}

function clean() {
	return del('./dist');
}

documentationPreprocessors = [
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*?)([a-zA-Z0-9_., *<>|]+)\[\]([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3Array<$4>$5}$6*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)[{]@code(?:link)? ([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1<code>$2</code>$3*/'
	},
	{
		pattern: /^\s*export\s+default\s+/gm,
		replace: ''
	}
];
