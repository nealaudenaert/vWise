var gulp = require('gulp');

// gulp plugins
var amdOptimize  = require('amd-optimize');
var autoprefixer = require('gulp-autoprefixer');
var compile      = require('gulp-compile');
var concat       = require('gulp-concat');
var less         = require('gulp-less');
var merge        = require('merge2');
var minifyHTML   = require('gulp-minify-html');
var tap          = require('gulp-tap');
var wrap         = require('gulp-wrap-amd');


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
    var templates = gulp.src(srcPath + '/js/**/*.ejs')
        // .pipe(tap(function (file, t) {
        //     if (file.path.match(/\.html\.ejs$/)) {
        //         return t.through(minifyHTML, [{ loose: true }]);
        //     }
        // }))
        .pipe(compile())
        .pipe(wrap());

    var jsFiles = gulp.src(srcPath + '/js/**/*.js');

    var main = merge(templates, jsFiles)
        .pipe(amdOptimize('main', {
            findNestedDependencies: true,
            paths: {
                'backbone':            vendorPath + '/backbone/backbone',
                'backbone.babysitter': vendorPath + '/backbone.babysitter/lib/backbone.babysitter',
                'backbone.wreqr':      vendorPath + '/backbone.wreqr/lib/backbone.wreqr',
                'interact':            vendorPath + '/interact/interact',
                'jquery':              vendorPath + '/jquery/dist/jquery',
                'marionette':          vendorPath + '/marionette/lib/core/backbone.marionette',
                'mousetrap':           vendorPath + '/mousetrap/mousetrap',
                'promise':             vendorPath + '/bluebird/js/browser/bluebird',
                'underscore':          vendorPath + '/underscore/underscore'
            },
            exclude: ['config']
        }))
        .pipe(concat('main.js'));

    var config = gulp.src(srcPath + '/js/config.js');

    var vendors = gulp.src([
            vendorPath + '/almond/almond.js'
        ])
        .pipe(concat('vendors.js'));

    return merge(vendors, config, main)
        .pipe(gulp.dest(distPath + '/js'));
});


gulp.task('stylesheets', function () {
    gulp.src(srcPath + '/less/style.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['> 5%']
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', ['html', 'javascripts', 'stylesheets'], function () {
    gulp.watch(srcPath + '/**/*.html', ['html']);
    gulp.watch(srcPath + '/js/**/*', ['javascripts']);
    gulp.watch(srcPath + '/less/**/*.less', ['stylesheets']);
});


gulp.task('default', ['javascripts', 'stylesheets', 'html']);
