let del = require('del');
let gulp = require('gulp');
let babel = require('gulp-babel');

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

if (gulpConfig.onTerminate) {
	process.on('SIGINT', gulpConfig.onTerminate.bind(null, 'SIGINT'));
	process.on('SIGTERM', gulpConfig.onTerminate.bind(null, 'SIGTERM'));
	process.on('SIGHUP', gulpConfig.onTerminate.bind(null, 'SIGHUP'));
}
