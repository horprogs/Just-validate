const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename');

const ASSETS_PATH = 'src';
const PROD_PATH = 'dist';

gulp.task('sass', function() {
    return gulp
        .src(`${ASSETS_PATH}/scss/**/*.scss`)
        .pipe(sass())
        .pipe(gulp.dest(`${ASSETS_PATH}/css/`))
        .pipe(browserSync.stream());
});

gulp.task('compressCSS', function() {
    return gulp
        .src([
            `${ASSETS_PATH}/css/**/*.css`,
            `!${ASSETS_PATH}/css/**/*.min.css`,
        ])
        .pipe(
            prefix({
                browsers: ['last 10 versions'],
            })
        )
        .pipe(gulp.dest(`${PROD_PATH}/css/`))
        .pipe(cssnano({ autoprefixer: false, zindex: false }))
        .pipe(
            rename({
                suffix: '.min',
            })
        )
        .pipe(gulp.dest(`${PROD_PATH}/css/`));
});

gulp.task('compressJS', function() {
    return gulp
        .src([`${PROD_PATH}/js/*.js`, `!${PROD_PATH}/js/*.min.js`])
        .pipe(uglify())
        .pipe(
            rename({
                suffix: '.min',
            })
        )
        .pipe(gulp.dest(`${PROD_PATH}/js`));
});

gulp.task('buildJS', function() {
    return gulp
        .src(['src/js/polyfills.js', 'src/js/app.js'])
        .pipe(concat('just-validate.js'))
        .pipe(babel())
        .pipe(gulp.dest(`${PROD_PATH}/js`));
});

gulp.task('watch', function() {
    gulp.watch(`${ASSETS_PATH}/css/**`, () => {
        browserSync.stream();
    });
    gulp.watch([`${ASSETS_PATH}/scss/**/*.scss`], gulp.series('sass'));
    gulp.watch([`${ASSETS_PATH}/**/*.js`, `${ASSETS_PATH}*.html`], () => {
        browserSync.reload;
    });
});

gulp.task('browserSync', function() {
    return browserSync.init({
        notify: false,
        server: {
            baseDir: `./${ASSETS_PATH}/`,
        },
    });
});

gulp.task('browserSync:prod', function() {
    return browserSync.init({
        server: {
            baseDir: `./${PROD_PATH}/`,
        },
    });
});

gulp.task('default', gulp.parallel('browserSync', 'watch'));

gulp.task('prod', gulp.parallel('browserSync:prod'));

// ------------ BEGIN: PRODUCTION TASKS ---------------

gulp.task('build', gulp.series('compressCSS', 'buildJS', 'compressJS'));
// ------------ END:   PRODUCTION TASKS ---------------
