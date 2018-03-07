require('babel-core/register.js')({
	presets: [require('babel-preset-es2015')]
});

let del = require('del');
let gulp = require('gulp');
let babel = require('gulp-babel');
var jasmine = require('gulp-jasmine');

let gulpConfig = {
	onTerminate() {
		setTimeout(() => {
			process.exit();
		});
	}
};

exports.build = gulp.series(
	clean,
	gulp.parallel(
		build,
		copy,
		copyLocales
	)
);

function build() {
	return gulp
		.src('./src/**/!(*Spec).js')
		.pipe(babel({
			moduleIds: true,
			plugins: ['transform-es2015-modules-commonjs']
		}))
		.pipe(gulp.dest('./dist'));
}

function copy() {
	return gulp
		.src(['./package.json', 'README.md'])
		.pipe(gulp.dest('./dist'));
}

function copyLocales() {
	return gulp
		.src(['./src/locales/*.json'])
		.pipe(gulp.dest('./dist/locales'));
}

function clean() {
	return del('./dist');
}

exports.test = test;
function test() {
	return gulp
		.src('./src/**/*Spec.js')
		.pipe(jasmine({ includeStackTrace: true }));
}

function devTest() {
	return test()
		.on('error', function(error) {
			console.error(error);

			this.emit('end');
		});
}

exports.dev = dev;
function dev() {
	return gulp.watch('./src/**/*.js', gulp.series([build, devTest]));
}

if (gulpConfig.onTerminate) {
	process.on('SIGINT', gulpConfig.onTerminate.bind(null, 'SIGINT'));
	process.on('SIGTERM', gulpConfig.onTerminate.bind(null, 'SIGTERM'));
	process.on('SIGHUP', gulpConfig.onTerminate.bind(null, 'SIGHUP'));
}
