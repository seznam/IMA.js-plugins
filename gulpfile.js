var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var karma = require('karma');
var eslint = require('gulp-eslint');
var es = require('event-stream');
var path = require('path');

var resolveNewPath = function(newBase){
	return es.mapSync(function (file) {
		var newBasePath = path.resolve(newBase);
		var namespaceForFile = '/' + path.relative(file.cwd + '/' + newBase, file.base) + '/';
		var newPath = newBasePath + namespaceForFile + file.relative;

		file.base = newBasePath;
		file.path = newPath;
		file.cwd = newBasePath;
		return file;
	});
};

// build client logic app
gulp.task('Es6ToEs5', function() {

	return (
		gulp.src('./src/**/*.js')
			//.pipe(resolveNewPath('/'))
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(babel({loose: "all", externalHelpers: false}))
			.pipe(plumber.stop())
			.pipe(gulp.dest('./dist'))
	);

});

// -------------------------------------PRIVATE HELPER TASKS
gulp.task('watch', function() {
	gulp.watch(['./src/**/*.js', './src/*.js'], ['Es6ToEs5']);
});