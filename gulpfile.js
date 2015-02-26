/*global require*/
var gulp = require('gulp');

var concat = require('gulp-concat');
var less   = require('gulp-less');


gulp.task('javascripts', function () {
    gulp.src([
        'build/vendor/jquery/dist/jquery.js',
        'build/vendor/interact/interact.js',
        'src/js/**/*.js'
    ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('stylesheets', function () {
    gulp.src('src/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});


gulp.task('html', function () {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/js/**/*.js', ['javascripts']);
    gulp.watch('src/less/**/*.less', ['stylesheets']);
});


gulp.task('default', ['javascripts', 'stylesheets', 'html']);
