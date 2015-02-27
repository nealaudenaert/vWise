var gulp = require('gulp');

// gulp plugins
var amdOptimize = require('amd-optimize');
var concat      = require('gulp-concat');
var less        = require('gulp-less');
var merge       = require('merge2');


// path configuration
var srcPath     = 'src';
var stagingPath = 'build';
var vendorPath  = stagingPath + '/vendor';
var distPath    = 'dist';


gulp.task('html', function () {
    gulp.src(srcPath + '/**/*.html')
        .pipe(gulp.dest(distPath));
});

gulp.task('javascripts', function () {
    var jsFiles = gulp.src(srcPath + '/js/**/*.js')
        .pipe(amdOptimize('main', {
            findNestedDependencies: true,
            paths: {
                'backbone':            vendorPath + '/backbone/backbone',
                'backbone.babysitter': vendorPath + '/backbone.babysitter/lib/backbone.babysitter',
                'backbone.wreqr':      vendorPath + '/backbone.wreqr/lib/backbone.wreqr',
                'interact':            vendorPath + '/interact/interact',
                'jquery':              vendorPath + '/jquery/dist/jquery',
                'marionette':          vendorPath + '/marionette/lib/core/backbone.marionette',
                'promise':             vendorPath + '/bluebird/js/browser/bluebird',
                'underscore':          vendorPath + '/underscore/underscore'
            }
        }))
        .pipe(concat('main.js'));

    var vendors = gulp.src([
        vendorPath + '/almond/almond.js'
    ])
        .pipe(concat('vendors.js'));

    return merge(vendors, jsFiles)
        .pipe(gulp.dest(distPath + '/js'));
});


gulp.task('stylesheets', function () {
    gulp.src(srcPath + '/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function () {
    gulp.watch(srcPath + '/**/*.html', ['html']);
    gulp.watch(srcPath + '/js/**/*', ['javascripts']);
    gulp.watch(srcPath + '/less/**/*.less', ['stylesheets']);
});


gulp.task('default', ['javascripts', 'stylesheets', 'html']);
