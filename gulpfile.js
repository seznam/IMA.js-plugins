require('babel-core/register.js')({
	'plugins': [
		require('babel-plugin-transform-es2015-modules-commonjs')
	]
});

let gulp = require('gulp');
let babel = require('gulp-babel');
let path = require('path');
let jasmine = require('gulp-jasmine');
let yuidoc = require('gulp-yuidoc');
let change = require('gulp-change');

exports.build = build_js;
function build_js() {
	return gulp
		.src('./src/**/!(*Spec).js')
		.pipe(babel({
			moduleIds: true,
			plugins: ['transform-es2015-modules-commonjs']
		}))
		.pipe(gulp.dest('./dist'));
}

exports.test = test;
function test() {
	return gulp
		.src('./src/**/*Spec.js')
		.pipe(jasmine({ includeStackTrace: true }));
}

exports.dev = dev;
function dev() {
	return gulp.watch(['./src/**/*.js'], test);
}

exports.doc = doc;
function doc() {
	return gulp
		.src('./src/**.js')
		.pipe(change(function(content) {
			let oldContent = null;

			while (content !== oldContent) {
				oldContent = content;
				documentationPreprocessors.forEach((preprocessor) => {
					content = content.replace(
						preprocessor.pattern,
						preprocessor.replace
					);
				});
			}

			return content;
		}))
		.pipe(yuidoc({}, { 'themedir': path.resolve('./doc/yuidocTheme') }))
		.pipe(gulp.dest('./doc'));
}

documentationPreprocessors = [
	{
		pattern: /\/[*][*]((?:a|[^a])*?)(?: |\t)*[*]\s*@(?:override|inheritDoc|abstract)\n((a|[^a])*)[*]\//g,
		replace: '/**$1$2*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@implements(?: (.*))?\n((a|[^a])*)[*]\//g,
		replace: '/**$1@extends $2\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@interface (.*)\n((a|[^a])*)?[*]\//g,
		replace: '/**$1@class $2\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@see (.*)\n((a|[^a])*)[*]\//g,
		replace: '/**$1\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)[{]@code(?:link)? ([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1<code>$2</code>$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)[*]([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3any$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)<([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3&lt;$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)>([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3&gt;$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*?)([a-zA-Z0-9_.]+)\[\]([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3Array<$4>$5}$6*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)(?: |\t)*[*]\s*@template\s*.*\n((a|[^a])*)[*]\//g,
		replace: '/**$1$2*/'
	},
	{
		pattern: /@(type|param|return)\s{([^{}]*){([^{}]*)}([^{}]*)}/g,
		replace: '@$1 {$2&#123;$3&#125;$4}'
	}
];
