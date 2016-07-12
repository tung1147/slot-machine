/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var sep = require('path').sep;
var normalize = require('path').normalize;
var slash = require('slash');
var gulpInject = require('gulp-inject');
var es = require('event-stream');
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var path = require('path');
//var scssFiles = ['./public_html/scss/**/*.scss'];
var scssFiles = ['./public_html/scss/gameplay.scss'];
var serviceFiles = ['./public_html/js/service/*.js'];
var factoryFiles = ['./public_html/js/factory/*.js'];
var gameFiles = ['./public_html/js/games/*.js'];
var jsFiles = ['./public_html/js/*.js'];
var libFiles =
        ['./public_html/bower_components/EaselJS/lib/easeljs-0.8.2.min.js',
            './public_html/bower_components/PreloadJS/lib/preloadjs-0.6.2.min.js',
            './public_html/bower_components/TweenJS/lib/tweenjs-0.6.2.min.js',
            './public_html/bower_components/SoundJS/lib/soundjs-0.6.2.min.js',
            './public_html/lib/jquery-2.1.0.min.js',
            './public_html/lib/EventEmitter.js'];
        
  
gulp.task('sass', function () {
    return gulp.src(scssFiles)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./public_html/scss'));
});


gulp.task('build-services', function () {
    return gulp.src(serviceFiles)
            .pipe(concat('services.js'))
            .pipe(gulp.dest('./public_html'));
});

gulp.task('build-factories', function () {
    return gulp.src(factoryFiles)
            .pipe(concat('factories.js'))
            .pipe(gulp.dest('./public_html'));
});

gulp.task('js', function () {
    return gulp.src(jsFiles)
            .pipe(concat('main.js'))
            .pipe(gulp.dest('./public_html'));
});

gulp.task('build-games', function () {
    return gulp.src(gameFiles)
            .pipe(concat('games.js'))
            .pipe(gulp.dest('./public_html'));
});


gulp.task('build.index', function () {
    return gulp.src('index.html')
         .pipe(inject([
            './public_html/js/service/**/*.js',
            './public_html/js/factory/**/*.js',
            './public_html/js/games/**/*.js',
            './public_html/js/*.js'
         ], ""))
            .pipe(inject(libFiles, 'bower'))
            .pipe(gulp.dest('./public_html'));
});

gulp.task('build-lib', function () {
    return gulp.src(libFiles)
            .pipe(concat('lib.js'))
            .pipe(gulp.dest('./public_html'));
});

gulp.task('watch', function () {
    gulp.watch(scssFiles, ['sass']);
//    gulp.watch(jsFiles, ['js']);
//    gulp.watch(serviceFiles, ['build-services']);
//    gulp.watch(factoryFiles, ['build-factories']);
//    gulp.watch(gameFiles, ['build-games']);
});



function inject(files, name) {
  return gulpInject(gulp.src(files, { read: false }), {
      name: name,
      transform: transformPath
  });
}





function transformPath(filepath) {
  var path = normalize(filepath).split(sep);
  arguments[0] = './' + path.slice(2, path.length).join(sep);
  return slash(gulpInject.transform.apply(gulpInject.transform, arguments));
}