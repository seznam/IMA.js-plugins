const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const cache = require('gulp-cached');
const remember = require('gulp-remember');
const rename = require('gulp-rename');

exports.__requiresConfig = true;

exports.default = () => {
  function clean() {
    return del(['./dist']);
  }

  function compile() {
    return gulp
      .src([
        './src/**/*.{js,jsx}',
        '!./src/**/__tests__{,/**/*}',
        './src/**/__tests__/*Suite.js'
      ])
      .pipe(cache('compile'))
      .pipe(
        babel({
          moduleIds: true,
          presets: ['@babel/preset-react'],
          plugins: ['@babel/plugin-transform-modules-commonjs']
        })
      )
      .pipe(remember('compile'))
      .pipe(
        rename((path) => {
          path.extname = '.js';
        })
      )
      .pipe(gulp.dest('./dist'));
  }

  function copy() {
    return gulp
      .src(['./src/**/*.!(js|jsx)', '!./src/**/__tests__{,/**/*}'])
      .pipe(gulp.dest('./dist'));
  }

  return {
    build: gulp.series(clean, compile, copy)
  };
};
