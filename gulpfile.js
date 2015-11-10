var gulp = require('gulp'),
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    zip = require('gulp-zip'),
    del = require('del'),
    shell = require('gulp-shell'),
    useref = require('gulp-useref'),
    sass = require('gulp-sass');

gulp.task('default', ['copy-assets', 'css'], function() {
  // place code for your default task here
});

var srcFolder = './app/';
var tempFolder = './temp/';
var releaseFolder = './release/';

gulp.task('copy-assets', function(cb) {
  gulp.src([
    srcFolder + './+(res|xml|json)/**'
    ,srcFolder + './background.js'
    ,srcFolder + './lib/bootstrap/**'
    ,srcFolder + './lib/blockly/**'
    ,srcFolder + './css/!(main).css'
    ,srcFolder + './manifest.json'
], {base: srcFolder})
    .pipe(gulp.dest(tempFolder));
});

gulp.task('css', function(cb){
  gulp.src(srcFolder + './css/main.css')
        .pipe(minifyCss({advanced:false}))
        .pipe(gulp.dest(tempFolder + 'css/'));
});

gulp.task('useref', function() {
  return gulp.src(srcFolder + './main.html')
    .pipe(useref())
    .pipe(gulp.dest(tempFolder));
});

gulp.task('prepare', ['copy-assets', 'sass', 'css', 'rjs', 'useref'], function(cb) {
});

gulp.task('zip', function(cb) {
  gulp.src(tempFolder + '**')
    .pipe(zip('package.zip'))
    .pipe(gulp.dest(releaseFolder));
});

gulp.task('clear-up', function(cb) {
  del(tempFolder);
});

//couldn't get run-sequence to work - this works around it...
gulp.task('default', shell.task([
  'gulp prepare'
  ,'gulp zip'
  ,'gulp clear-up'
]));

gulp.task('rjs', function(cb) {
  rjs({
      name: 'main',
      baseUrl: srcFolder +'js/',
      out: 'main.js',
      include: ['requireLib'],
      mainConfigFile: srcFolder + "js/main.js"
  })
  .pipe(uglify({output:{ascii_only:true}}))
  .pipe(gulp.dest(tempFolder)); // pipe it to the output DIR

  cb();
});

gulp.task('sass', function () {
  gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});
