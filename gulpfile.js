var gulp = require("gulp"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  terser = require("gulp-terser");

function minifyCSS() {
  return gulp.src("src/*.css")
    .pipe(cleanCSS())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("./dist/css"));
}

function minifyJS() {
  return gulp.src("src/*.js")
    .pipe(terser())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("./dist/js"));
}

exports.default = gulp.parallel(minifyCSS, minifyJS);