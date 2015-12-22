var gulp = require( 'gulp' );
var sourcemaps = require( 'gulp-sourcemaps' );
var babel = require( 'gulp-babel' );
var plumber = require( 'gulp-plumber' );
var karma = require( 'karma' );
var eslint = require( 'gulp-eslint' );
var path = require( 'path' );

// build client logic app
gulp.task('build', function() {

	return (
		gulp.src( './src/**/*.js' )
		.pipe( plumber() )
		.pipe( sourcemaps.init() )
		.pipe( babel( {
			moduleIds: true,
			presets: [ 'es2015-loose' ],
			plugins: [ 'transform-es2015-modules-commonjs', 'external-helpers-2' ]
		} ) )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( './dist' ) )
	);

} );

gulp.task('test', function() {

	return (
		gulp.src( './src/**/*.js' )
		.pipe( plumber() )
		.pipe( sourcemaps.init() )
		.pipe( babel( {
			moduleIds: true,
			presets: [ 'es2015-loose' ],
			plugins: [ 'transform-es2015-modules-commonjs', 'external-helpers-2' ]
		} ) )
		.pipe( plumber.stop() )
		.pipe( gulp.dest( './dist' ) )
	);

} );

// -------------------------------------PRIVATE HELPER TASKS
gulp.task( 'watch', function() {
	gulp.watch( [ './src/**/*.js', './src/*.js' ], [ 'build' ] );
} );
