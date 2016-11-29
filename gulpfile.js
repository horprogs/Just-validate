var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    rename = require("gulp-rename");

var ASSETS_PATH = 'src';


gulp.task('compressJS', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function () {
    gulp.watch([ASSETS_PATH+ '/js/*.js'], browserSync.reload);
});

gulp.task('browserSync', function () {
    return browserSync.init({
       server: {
           baseDir: './src/'
       }
    });
});

gulp.task('default', ['browserSync', 'watch']);


// ------------ BEGIN: PRODUCTION TASKS ---------------

gulp.task('build', function () {
    runSequence(['compressCSS', 'compressJS'])
})
// ------------ END:   PRODUCTION TASKS ---------------