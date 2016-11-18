'use strict';

let gulp = require('gulp');
let runSequence = require('run-sequence');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let webserver = require('gulp-webserver');
let babelify = require("babelify");

// build
gulp.task('build', () => {
  runSequence(['browserify']);
});

// browserify
gulp.task('browserify', () => {
  browserify('./js/app.js', {
    debug:   true,
    require: ['moment', 'pikaday', 'zeroclipboard', 'numbro']
  })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', () => {
  gulp.watch('./js/**/*.js', ['build']);
});

gulp.task('server', () => {
  gulp.src('./')
    .pipe(webserver({
      host: '127.0.0.1',
      livereload: true
    })
  );
});

// default
gulp.task('default', ['build', 'watch', 'server']);
