var gulp            = require('gulp'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    sass            = require('gulp-sass'),
    path            = require('path'),
    livereload      = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
    marked          = require('marked'), // For :markdown filter in jade
    changed         = require('gulp-changed'),
    prettify        = require('gulp-html-prettify'),
    minifyCSS       = require('gulp-minify-css'),
    htmlify         = require('gulp-angular-htmlify'),
    rename          = require('gulp-rename'),
    gutil           = require('gulp-util'),
    sourcemaps      = require('gulp-sourcemaps'),
    ngAnnotate      = require('gulp-ng-annotate'),
    through         = require('through2'),
    ngConstant      = require('gulp-ng-constant');
    gettext         = require('gulp-angular-gettext');
    templateCache   = require('gulp-angular-templatecache');

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignore_index = '/app/*.html';
var ignored_files = '!'+hidden_files;

// SOURCES CONFIG 
var source = {
    base: 'src',
    vendors: {
        dir: '../vendor'
    },
    script: {
        files: ['/app/**/*.js'],
        watch: ['/app/**/*.js', hidden_files]
    },
    html: {
        files : ['/app/**/*.html'],
        watch: ['/app/**/*.html', hidden_files]
    },
    resources:{
        styles: {
            dir:  '/resources/sass',
            watch: ['/resources/sass/**/*.scss'],
            name: ['/style.scss']
        },
        images: {
            dir:  '/resources/images',
            files:  '/**/*.*',
            watch: ['/**/*.*']
        },
        fonts: {
            dir:  '/resources/fonts/bootstrap',
            watch: ['/**/*.*'],
            glyphiconsHalflingsRegular: ['/glyphicons-halflings-regular.*']
        },
    }
};

// BUILD TARGET CONFIG
var build = {
    dist: 'dist/app',
    templates: '/tpls',
    scripts: {
        dir: '/js',
        app: {
            main: '/app.js',
            vendor: '/vendors.js'
        }
    },
    resources: {
        styles: {
            dir: '/css'
        },
        images: {
            dir: '/images'
        },
        fonts: {
            dir:  '/fonts/bootstrap',
        },
    }
};

//---------------
// TASKS
//---------------

// JS APP
gulp.task('scripts', function() {    // Minify and copy all JavaScript
    return gulp.src([source.base + source.script.files])
        .pipe(concat(build.scripts.dir + build.scripts.app.main))
        .on("error", handleError)
        .pipe(ngAnnotate())
        .on("error", handleError)
        .pipe(gulp.dest(build.dist))
        ;
});

// APP HTML
gulp.task('templates', function() {
    return gulp.src([source.base + source.html.files,
        '!' + source.base + ignore_index
    ])
        .pipe(htmlify())
        .pipe(gulp.dest(build.dist + build.templates))
        ;
});

// APP INDEX
gulp.task('templates:index', function() {
    return gulp.src(source.base + ignore_index)
        .pipe(htmlify())
        .pipe(gulp.dest(build.dist))
        ;
});

// SASS APP
gulp.task('styles', function() {
    return gulp.src(source.base + source.resources.styles.dir + source.resources.styles.name)
        .pipe(sourcemaps.init())
        .pipe(sass({
            paths: [source.base + source.resources.styles.dir]
        }))
        .on("error", handleError)
        .pipe(sourcemaps.write() )
        .pipe(gulp.dest(build.dist + build.resources.styles.dir))
        ;
});

// Bootstrap Fonts
gulp.task('fonts', function() {
    return gulp.src(source.base + source.resources.fonts.dir + source.resources.fonts.glyphiconsHalflingsRegular)
        .pipe(gulp.dest(build.dist + build.resources.fonts.dir))
        ;
});

// VENDOR TASKS
// --------------

var vendor = require('./vendors.json');
gulp.task('vendor', function() {

    return gulp.src(vendor.vendor_files.js)
        .pipe(concat(build.scripts.dir + build.scripts.app.vendor))
        .on("error", handleError)
        .pipe( uglify() )
        .pipe(gulp.dest(build.dist))
        ;
});

//---------------
// WATCH
//---------------

gulp.task('watch', function () {
    gulp.watch('src/resources/sass/**/*.scss', ['styles']);
    gulp.watch('src/app/**/*.js', ['scripts']);
    gulp.watch('src/app/**/*.html', ['templates', 'templates:index']);
});

gulp.task('app', ['templates', 'templates:index', 'scripts', 'vendor', 'styles', 'fonts']);


//---------------
// HELPERS
//---------------
//
//// Error handler
function handleError(err) {
    console.log(err.toString());
    gutil.log(err);
    gutil.beep();
    this.emit('end');
}