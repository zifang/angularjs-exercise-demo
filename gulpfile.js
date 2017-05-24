// Generated on 2017-03-08 using generator-angular 0.15.1
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var path = require('path');
var minimist = require('minimist');
var gutil = require('gulp-util');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var yeoman = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist'
};

var paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  styles: [yeoman.app + '/styles/**/*.scss'],
  fonts: [yeoman.app + '/fonts/*'],
  jsons: [yeoman.app + '/json/*.json'],
  views: {
    main: yeoman.app + '/index.html',
    files: [yeoman.app + '/views/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'expanded',
    precision: 10
  })
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, '.tmp/styles');


//默认development环境
var knowOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'development'
  }
};
var options = minimist(process.argv.slice(2), knowOptions);
//生成filename文件，存入string内容
function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return src
}

gulp.task('appConfig', function() {
  var myConfig = require('./config.json');   //读入config.json文件
  var envConfig = myConfig[options.env];  //取出对应的配置信息
  var conConfig = 'appconfig = ' + JSON.stringify(envConfig);
  //生成config.js文件
  return string_src("config.js", conConfig)
      .pipe(gulp.dest(yeoman.app+'/scripts/'))
});

///////////
// Tasks //
///////////


gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

//检测scripts
gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('start:client', ['start:server', 'styles','fonts'], function () {
  openURL('http://localhost:9000');
});

gulp.task('start:server', function() {
  $.connect.server({
    root: [yeoman.app, '.tmp'],
    livereload: true,
    // Change this to '0.0.0.0' to access the server from outside.
    port: 9000
  });
});

gulp.task('watch', function () {
  $.watch(paths.styles)
    .pipe($.plumber())
    .pipe(styles())
    .pipe($.connect.reload());

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe($.connect.reload());

  gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', function (cb) {
  runSequence('clean:tmp',
    'appConfig',
    'fonts',
    ['lint:scripts'],
    ['start:client'],
    'watch', cb);
});

gulp.task('serve:prod', function() {
  $.connect.server({
    root: [yeoman.dist],
    livereload: true,
    port: 9000
  });
});

// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: yeoman.app + '/bower_components',
      // optional: 'configuration',
      // goes: 'here',
      ignorePath: '..'
    }))
  .pipe(gulp.dest(yeoman.app));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('client:build', ['html', 'styles','json','fonts'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(paths.views.main)
    .pipe($.useref({searchPath: [yeoman.app, '.tmp']}))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe($.rev())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe($.rev())
    .pipe(cssFilter.restore())
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.dist))
    .pipe(rev.manifest())      //- 生成一个rev-manifest.json
    .pipe(gulp.dest(yeoman.app +'/rev'));    //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('html', function () {
  return gulp.src(['app/rev/*.json' , yeoman.app + '/views/**/*'])
    .pipe(revCollector())
    .pipe(gulp.dest(yeoman.dist + '/views'));
});

//字体文件引入
gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2,otf}'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('json', function () {
  return gulp.src(paths.jsons)
    .pipe(gulp.dest(yeoman.dist + '/json'));
})

gulp.task('images', function () {
  return gulp.src(yeoman.app + '/images/**/*')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('build', ['clean:dist'], function () {
  runSequence(['appConfig','images','fonts', 'copy:extras', 'client:build']);
});

gulp.task('default', ['build']);
