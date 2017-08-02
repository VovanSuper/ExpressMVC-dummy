'use strict';

var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  chalk = require('chalk'),
  spawn = require('child_process').spawn,
  mocha = require('gulp-mocha'),
  gutil = require('gulp-util'),
  env = require('gulp-env'),
  autoprefixr = require('gulp-autoprefixer'),
  cached = require('gulp-cached'),
  del = require('del'),
  debug = require('gulp-debug'),
  concat = require('gulp-concat'),
  combiner = require('stream-combiner2').obj,
  gulpIf = require('gulp-if'),
  newer = require('gulp-newer'),
  notify = require('gulp-notify'),
  remember = require('gulp-remember'),
  plumber = require('gulp-plumber'),
  path = require('path'),
  sourcemaps = require('gulp-sourcemaps'),
  stylus = require('gulp-stylus'),
  vinyl = require('vinyl-fs'),
  bunyan,
  log = console.log;



var paths = {
  public: './public/**/*.*',
  dist: './dist'
};
var isStyl = function(file) {
  return file.extname == '.styl'
};
var clean = function(path, cb) {
  del(path, {
    force: true
  });
  cb();
};
var isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('clean', function(cb) {
  clean(paths.dist, cb);
});



gulp.task('compile:styles', ['clean'], function() {
  return combiner(
      gulp.src(paths.public)
      // ,cached('styles')
      // ,newer(paths.public)
      , debug({
        title: '[src ::]'
      }), gulpIf(isDev, sourcemaps.init()) // we could set a lot of config as we need using the gulpIf`s and actions
      , gulpIf(isStyl, stylus()), debug({
        title: '[gulpIf ::]'
      }), autoprefixr()
      // , remember('styles')
      , concat('all.css'), gulpIf(isDev, sourcemaps.write()) // 
      , debug({
        title: '[All.css ::]'
      }), gulp.dest('./dist')
      // we can use more robust definitions in gulp.dest (returns string path), i.e : gulp.dest(function(file){ if file.base == 'something' return 'newDestPath' + file.path })
    )
    .on('error', notify.onError(function(err) {
      return {
        MainTitle: 'Error during pipeline',
        ErrorMsg: err.message,
        FullError: JSON.stringify(err)
      }
    }));

});

gulp.task('test', function() {
  env.set({
    NODE_ENV: 'test',
    ENV: 'test'
  });
  gulp.src('./tests/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'nyan'
    }))
    .on('error', gutil.log);
});

gulp.task('mv', function() {
  return combiner(
    gulp.src(paths.public)
    .on('data', function(file) {
      console.log({
        Cwd: file.cwd,
        Path: file.path,
        Base: file.base,
        Rel: file.relative,
        ExtName: file.extname,
        Stem: file.stem,
        Stat: file.stat
      })
    }),
    gulp.dest('dist')
  ).on('error', notify.onError(function(err) {
    return {
      title: 'Combiner Error',
      ErrorMsg: err.message,
      fullError: err
    }
  }));
});

gulp.task('nodemon', function() {
  var stream = nodemon({
      watch: ['app.js', 'file.html', './Controllers', './middlewares', './models', './plugins', './public', './routes', './utils'],
      script: 'app',
      ext: 'js',
      ignore: ['./node_modules', './mongod', './data']
    })
    .on('readable', function() {
      // free memory 
      bunyan && bunyan.kill();
      var bunyan = spawn('./node_modules/bunyan/bin/bunyan', [
        '--output', 'short',
        '--color'
      ]);

      bunyan.stdout.pipe(process.stdout);
      bunyan.stderr.pipe(process.stderr);
      this.stdout.pipe(bunyan.stdin);
      this.stderr.pipe(bunyan.stdin);
    })
    .on('restart', function() {
      log(chalk.bgGreen.red.bold('Restarting gulp'));
    })
    .on('start', function() {
      log(chalk.bgGreen.black.bold('Starting gulp'));
    })
    .on('crash', function() {
      log(chalk.bgRed.black.bold('Crashed... restatring'));
      stream.emit('restart', 10);
    });
});

gulp.task('dist', ['clean', 'compile:styles']);

gulp.task('default', ['clean', 'mv', 'nodemon']);
