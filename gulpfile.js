require('babel-core/register.js')({
	'plugins': 'transform-es2015-modules-commonjs'
});

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var path = require('path');
var jasmine = require('gulp-jasmine');
var yuidoc = require('gulp-yuidoc');
var change = require('gulp-change');


// build module
gulp.task('build', function() {
	return (
		gulp.src('./src/**/!(*Spec).js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			moduleIds: true,
			plugins: ['transform-es2015-modules-commonjs']
		}))
		.pipe(gulp.dest('./dist'))
	);
});

//run test
gulp.task('test', () => {
	return (
		gulp.src('./src/**/*Spec.js')
			.pipe(jasmine({ includeStackTrace: true }))
	);
});


// -------------------------------------PRIVATE HELPER TASKS
gulp.task('dev', function() {
	gulp.watch(['./src/**/*.js'], ['test']);
});

gulp.task('doc', function() {
	return (
		gulp
			.src('./src/*.js')
			.pipe(change(function(content) {
				var oldContent = null;

				while (content !== oldContent) {
					oldContent = content;
					documentationPreprocessors.forEach(function(preprocessor) {
						content = content.replace(
							preprocessor.pattern,
							preprocessor.replace
						);
					});
				}

				return content;
			}))
			.pipe(yuidoc({}, { 'themedir': path.resolve('./doc/yuidocTheme') }))
			.pipe(gulp.dest('./doc'))
	);
});

documentationPreprocessors = [
	{
		pattern: /\/[*][*]((?:a|[^a])*?)(?: |\t)*[*]\s*@(?:override|inheritdoc|abstract)\n((a|[^a])*)[*]\//g,
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
