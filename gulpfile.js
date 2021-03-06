'use strict';

var gulp = require( 'gulp' );
var nodemon = require( 'gulp-nodemon' );
var mocha = require( 'gulp-mocha' );
var istanbul = require( 'gulp-istanbul' );
var env = require( 'gulp-env' );

/**
 * Run backend tests
 */

gulp.task( 'env:test', function () {
  env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});

gulp.task( 'pre-test:backend', function () {
  return gulp.src([ 'backend/api/**/*.model.js', 'backend/api/**/*.controller.js', '!backend/api/**/*.spec.js' ])
    // Covering files
    .pipe( istanbul() )
    // Force `require` to return covered files
    .pipe( istanbul.hookRequire() );
});

gulp.task( 'test:backend', [ 'pre-test:backend', 'env:test' ], function () {
  return gulp.src([ 'backend/api/**/*.spec.js' ])
    .pipe( mocha({ reporter: 'spec' }) )
    // Creating the reports after tests ran
    .pipe( istanbul.writeReports() )
    // Enforce a coverage value
    .pipe( istanbul.enforceThresholds({ thresholds: { global: 100 } }) );
});

gulp.task( 'test', [ 'test:backend' ], function () {});

gulp.task( 'serve', function () {
  nodemon({
    script: 'backend/app.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task( 'serve:dist', [ 'build' ], function () {
  nodemon({
    script: 'backend/app.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'production' }
  });
});
