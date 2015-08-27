// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  clean = require('gulp-clean'),
  browserify = require('gulp-browserify'),
  concat = require('gulp-concat');

// tasks
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
    gulp.src('./build/*')
      .pipe(clean({force: true}));
    gulp.src('./app/js/bundle.js')
      .pipe(clean({force: true}));
});

gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./build/'))
});

gulp.task('sass', function () {
  gulp.src(['./app/**/*.scss', '!./app/bower_components/**'])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 5%', 'last 2 version', 'ie 8', 'ie 9']
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./app/css'));
});

gulp.task('sass-build', function () {
  gulp.src(['./app/**/*.scss', '!./app/bower_components/**'])
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 5%', 'last 2 version', 'ie 8', 'ie 9']
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./app/**/*.scss', ['sass']);
});

gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify())
    .pipe(gulp.dest('./build/'))
});

gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('build/bower_components'));
});

gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-img-files', function () {
  gulp.src('./app/img/*.*')
    .pipe(gulp.dest('build/img/'));
});

gulp.task('copy-font-files', function () {
  gulp.src('./app/fonts/*.*')
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('serve', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});

gulp.task('serve-build', function () {
  connect.server({
    root: 'build/',
    port: 9999
  });
});

gulp.task('browserify', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./app/js'))
});

gulp.task('browserify:watch', function () {
  gulp.watch('./app/**/*.js', ['browserify']);
});

gulp.task('browserifyDist', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(uglify())
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./build/js'))
});


// default task
gulp.task('default',
  ['lint', 'sass', 'sass:watch', 'browserify', 'browserify:watch', 'serve']
);

// build task
gulp.task('build',
  ['lint', 'sass-build', 'browserifyDist', 'copy-html-files', 'copy-img-files', 'copy-font-files', 'copy-bower-components', 'serve-build']
);