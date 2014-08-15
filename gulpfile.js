var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    fileinclude = require('gulp-file-include'),
    path = require("path"),
    package = require('./package.json');


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

var paths = {
  htmlDir: 'src/',
  htmlDestinationDir: 'dist/',
  sassDir: 'src/scss/',
  sassDestinationDir: 'dist/assets/css',
  jsDir: 'src/js/',
  jsDestinationDir: 'dist/assets/js'
};

gulp.task('html', function() {
    return gulp.src(path.join(paths.htmlDir, '*.html'))
      .pipe(fileinclude())
      .pipe(gulp.dest(paths.htmlDestinationDir))
      .pipe(browserSync.reload({stream:true}));
});

gulp.task('css', function () {
    return gulp.src(path.join(paths.sassDir, 'style.scss'))
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest(paths.sassDestinationDir))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(paths.sassDestinationDir))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  return gulp.src(path.join(paths.jsDir, 'scripts.scss'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(paths.jsDestinationDir))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.jsDestinationDir))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task('default', ['css', 'js', 'html', 'browser-sync'], function () {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/*.html", ['html']);
});