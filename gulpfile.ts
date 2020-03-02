import * as browserify from "browserify";
import * as gulp from "gulp";
import * as rename from "gulp-rename";
import * as sourcemaps from "gulp-sourcemaps";
import * as ts from "gulp-typescript";
import * as uglify from "gulp-uglify";
import * as gutil from "gulp-util";
import * as path from "path";
import * as tts from "ttypescript";
import * as vbuffer from "vinyl-buffer";
import * as vsource from "vinyl-source-stream";

const MINIFY = true;
const $outputFileNameBase = "kk-save-edit";
const $outputFileName = `${$outputFileNameBase}.js`;
const $primaryDestination = "src/html";
const $secondaryDestination = "dist";

gulp.task("compile", () => {
    const tsProject = ts.createProject("./src/tsconfig.json", {
        typescript: tts
    });

    return gulp
        .src(["src/**/*.ts", "src/**/*.tsx"])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("src"));
});

gulp.task("bundle", () => {
    const files = [
        "src/ui/main.js"
    ];

    let pipe = browserify(files, {
        debug: true
    })
        .bundle()
        .on("error", gutil.log)
        .pipe(vsource($outputFileName))
        .pipe(vbuffer())
        .pipe(gulp.dest($primaryDestination));

    if (MINIFY) {
        pipe = pipe
            .pipe(rename({suffix: ".min"}))
            .pipe(uglify())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest($primaryDestination));
    }

    return pipe;
});

gulp.task("copy-min", () => {
    const fileName = `${$outputFileNameBase}.min.js`;

    return gulp
        .src([path.join($primaryDestination, fileName)])
        .pipe(rename(fileName))
        .pipe(gulp.dest($secondaryDestination));
});

gulp.task("build", (() => {
    if (MINIFY) {
        return gulp.series(gulp.task("bundle"), gulp.task("copy-min"));
    } else {
        return gulp.task("bundle");
    }
})());
