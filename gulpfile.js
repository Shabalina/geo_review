const gulp = require('gulp');
//const pug = require('gulp-pug');
//const handlebars = require('handlebars');
//const font = require('gulp-font');

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
//const spritesmith = require('gulp.spritesmith');

const del = require('del');

const browserSync = require('browser-sync').create();

const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const paths = {
    root: './build',
    templates: {
        //pages: 'src/templates/pages/*.pug',
        //src: 'src/templates/**/*.pug'
        //src: 'src/templates/*.hbs'
        src: 'src/templates/*.html'
    },
    styles: {
        //src: 'src/styles/**/*.scss',
        src: 'src/styles/*.scss',
        dest: 'build/assets/styles/'
    },    
    images: {
        //src: 'src/images/**/*.*',
        src: 'src/images/*.*',
        dest: 'build/assets/images/'
    },
    shaders: {
        src: 'src/shaders/**/*.*',
        dest: 'build/assets/shaders/'
    },

    scripts: {
        //src: 'src/scripts/**/*.js',
        src: 'src/scripts/*.js',
        dest: 'build/assets/scripts/'
    },

    php_scripts: {
        src: 'src/scripts/**/*.php'        
    },

    fonts: {
        src: 'src/fonts/**/*.woff2',
        dest: 'build/assets/fonts/'
    }
//    sprite:{
//        src: 'src/images/**/*.png',
//        dest: 'build/assets/images/',
//        imgLocation: '../assets/images/sprite.png',
//        distFile: 'build/assets/styles/sprite'
//    }
}

// pug
function templates() {
   // return gulp.src(paths.templates.pages)
    return gulp.src(paths.templates.src)
        //.pipe(pug({ pretty: true }))
       // .pipe(handlebars())
        .pipe(gulp.dest(paths.root));
}

// scss
function styles() {
    //return gulp.src('./src/styles/app.scss')
    return gulp.src('./src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
}


/*
function fonts() {
    return src(paths.fonts.src, {read: false})
        .pipe(gulpFont({
            ext: '.css',
        })
}*/

// очистка
function clean() {
    return del(paths.root);
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;

// webpack
function scripts() {
    //return gulp.src('src/scripts/app.js')
    return gulp.src('src/scripts/index.js')
        .pipe(gulpWebpack(webpackConfig, webpack)) 
        .pipe(gulp.dest(paths.scripts.dest));
}


// галповский вотчер
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.images.src, images);
    //gulp.watch(paths.shaders.src, shaders);
    gulp.watch('src/scripts/**/*.js', scripts);
    gulp.watch(paths.scripts.src, scripts);
    //gulp.watch(paths.fonts.src, fonts);
    //gulp.watch(paths.php_scripts.src, php_scripts);
}

// локальный сервер + livereload (встроенный)
function server() {
    browserSync.init({
        server: paths.root
    }); 
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

// просто переносим картинки
function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

//simply transfer php scripts to the root of the build folder
function php_scripts() {
    return gulp.src(paths.php_scripts.src)
        .pipe(gulp.dest(paths.root));
}


function shaders() {
    return gulp.src(paths.shaders.src)
        .pipe(gulp.dest(paths.shaders.dest));
}

// просто переносим шрифты
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

/*
function sprite(){
    var spriteData = gulp.src(path.sprite.src).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        cssFormat: 'css',
        imgPath: path.sprite.imgLocation,
        padding: 70
    }))
    spriteData.img.pipe(gulp.dest(path.sprite.dest));
    spriteData.css.pipe(gulp.dest(path.sprite.distFile));
}
*/

gulp.task('default', gulp.series(
    clean,
    //gulp.parallel(styles, templates, images, php_scripts, shaders, fonts, /*sprite,*/ scripts),
    gulp.parallel(styles, templates, images, scripts),
    
    gulp.parallel(watch, server)
));
