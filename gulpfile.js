var gulp = require("gulp"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  terser = require("gulp-terser");

function minifyCSS() {
  return gulp.src("src/FrontyMebloweProste/*.css")
    .pipe(cleanCSS())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("./dist/FrontyMebloweProste/"));
}

function minifyJS() {
  return gulp.src("src/FrontyMebloweProste/*.js")
    .pipe(terser())
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("./dist/FrontyMebloweProste/"));
}

exports.default = gulp.parallel(minifyCSS, minifyJS);