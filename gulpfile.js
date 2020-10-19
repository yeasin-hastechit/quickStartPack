var gulp = require('gulp'),
    clean = require('gulp-clean'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    fileInclude = require('gulp-file-include'),
    beautifyCode = require('gulp-beautify-code'),

    imagemin = require('gulp-imagemin'),
    imageminUPNG = require("imagemin-upng"),
    mozjpeg = require('imagemin-mozjpeg'),
    jpegRecompress = require('imagemin-jpeg-recompress'),
    svgo = require('imagemin-svgo'),

    // Source Folder Locations
    src = {
        'root': './src/',

        'html': './src/html/*.html',
        'partials': './src/partials/',

        'assets': './src/assets/**/*',

        'css': './src/assets/css/**/*',
        'pluginsCss': './src/assets/css/plugins/**/*',
        'vendorCss': './src/assets/css/vendor/**/*',

        'fonts': './src/assets/fonts/**/*',
        'images': './src/assets/images/**/*',

        'js': './src/assets/js/**/*',
        'pluginsJs': './src/assets/js/plugins/**/*',
        'vendorJs': ['./src/assets/js/vendor/modernizr-3.11.2.min.js', './src/assets/js/vendor/jquery-3.5.1.min.js', './src/assets/js/vendor/jquery-migrate-3.3.0.min.js', './src/assets/js/vendor/bootstrap.bundle.min.js'],
        'mainJs': './src/assets/js/main.js',

        'media': './src/assets/media/**/*',
        'php': './src/assets/php/**/*',

        'scss': './src/assets/scss/**/*',
        'custom': './src/assets/scss/custom.scss',
        'style': './src/assets/scss/style.scss'
    },

    // Destination Folder Locations
    dest = {
        'root': './dest/',

        'assets': './dest/assets/',
        'css': './dest/assets/css/',
        'js': './dest/assets/js/',
        'images': './dest/assets/images/'
    },

    // Autoprefixer Options
    autoPreFixerOptions = [
        "last 4 version",
        "> 1%",
        "ie >= 9",
        "ie_mob >= 10",
        "ff >= 30",
        "chrome >= 34",
        "safari >= 7",
        "opera >= 23",
        "ios >= 7",
        "android >= 4",
        "bb >= 10"
    ];

/*-- 
    Live Synchronise & Reload
--------------------------------------------------------------------*/
function liveBrowserSync(done) {
    browserSync.init({
        server: {
            baseDir: dest.root
        }
    });
    done();
}
function reload(done) {
    browserSync.reload();
    done();
}

/*-- 
    Gulp Tasks
--------------------------------------------------------------------*/

/*-- Remove Destination Folder Before Starting Gulp --*/
function cleanProject(done) {
    gulp.src(dest.root)
        .pipe(clean());
    done();
}

/*-- 
    All HTMl Files Compile With Partial & Copy Paste To Destination Folder
--------------------------------------------------------------------*/
function html(done) {
    gulp.src(src.html)
        .pipe(fileInclude({ basepath: src.partials }))
        .pipe(beautifyCode())
        .pipe(gulp.dest(dest.root));
    done();
}
/*-- 
    All Assets Files from SRC to DEST Folder
--------------------------------------------------------------------*/
function assets(done) {
    gulp.src(src.assets)
        .pipe(gulp.dest(dest.assets));
    done();
}

/*-- 
    CSS & SCSS Task
--------------------------------------------------------------------*/

/* Plugins CSS */
function pluginsCss(done) {
    gulp.src(src.pluginsCss)
        .pipe(concat('plugins.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(dest.css));
    done();
}
/* Vendor CSS */
function vendorCss(done) {
    gulp.src(src.vendorCss)
        .pipe(concat('vendor.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(dest.css));
    done();
}

/*-- Gulp Compile Style Scss to Css Task & Minify --*/
function styleCss(done) {
    gulp.src(src.style)
        .pipe(sourcemaps.init())

        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(autoprefixer(autoPreFixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.stream())

        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer(autoPreFixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.stream());

    done();
}
/*-- Gulp Compile Custom Scss to Css Task & Minify --*/
function customCss(done) {
    gulp.src(src.custom)

        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(concat('custom.css'))
        .pipe(autoprefixer(autoPreFixerOptions))
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.stream())

        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat('custom.min.css'))
        .pipe(autoprefixer(autoPreFixerOptions))
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.stream());

    done();
}

/*-- 
    JS Task
--------------------------------------------------------------------*/

/* Plugins JS */
function pluginsJs(done) {
    gulp.src(src.pluginsJs)
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest.js));
    done();
}
/* Vendor JS */
function vendorJs(done) {
    gulp.src(src.vendorJs)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest.js));
    done();
}
/* Main JS */
function mainJs(done) {
    gulp.src(src.mainJs)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest.js));
    done();
}

/*-- 
    Image Optimization
--------------------------------------------------------------------*/
function imageOptimize(done) {
    gulp.src(src.images)
        .pipe(imagemin(
            [imageminUPNG(), mozjpeg(), jpegRecompress(), svgo()],
            { verbose: true }
        ))
        .pipe(gulp.dest(dest.images));
    done();
}

/*-- 
    All, Watch & Default Task
--------------------------------------------------------------------*/

/*-- All --*/
gulp.task('clean', cleanProject);
gulp.task('imageOptimize', imageOptimize);
gulp.task('allTask', gulp.series(html, assets, pluginsCss, vendorCss, styleCss, customCss, pluginsJs, vendorJs, mainJs));

/*-- Watch --*/
function watchFiles() {
    gulp.watch([src.html, src.partials, src.css, src.fonts, src.images, src.js, src.media, src.php], gulp.series([html, assets, pluginsCss, vendorCss, pluginsJs, vendorJs, mainJs], reload));
    gulp.watch(src.scss, gulp.series(styleCss));
}

/*-- Default --*/
gulp.task('default', gulp.series('allTask', gulp.parallel(liveBrowserSync, watchFiles)));