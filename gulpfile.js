var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename");

var ASSETS_PATH = 'src';
var PROD_PATH = 'dist';

gulp.task('compressJS', function () {
    return gulp.src(['dist/js/*.js', '!dist/js/*.min.js'])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('buildJS', function () {
    return gulp.src(['src/js/polyfills.js', 'src/js/app.js'])
        .pipe(concat('just-validate.js'))
        .pipe(babel())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function () {
    gulp.watch([ASSETS_PATH + '/**/*.js', ASSETS_PATH + '*.html'], browserSync.reload);
});

gulp.task('browserSync', function () {
    return browserSync.init({
        server: {
            baseDir: './src/'
        }
    });
});

gulp.task('browserSync:prod', function () {
    return browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });
});

gulp.task('default', ['browserSync', 'watch']);

gulp.task('prod', ['browserSync:prod']);


// ------------ BEGIN: PRODUCTION TASKS ---------------

gulp.task('build', function () {
    runSequence('buildJS', 'compressJS');
});
// ------------ END:   PRODUCTION TASKS ---------------