var gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    inlineNg2Styles = require('gulp-inline-ng2-styles'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    inlineNg2Template = require('gulp-inline-ng2-template');


//билд компонентов по папкам
function buildComponent(componentPath) {
    return function () {
        var baseSrcPath = "./src/aGrid", baseLibPath = "./lib/aGrid";

        var tsProject = ts.createProject('tsconfig.json', { declaration: true });

        if (componentPath) {
            baseSrcPath += "/" + componentPath;
            baseLibPath += "/" + componentPath;
        }

        tsResult = gulp.src([baseSrcPath + '/*.ts','!'+baseSrcPath + '/*.spec.ts'])
            .pipe(inlineNg2Template({ base: baseSrcPath }))
            .pipe(inlineNg2Styles({ base: baseSrcPath }))
            .pipe(tsProject());

        return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
            tsResult.dts.pipe(gulp.dest(baseLibPath)),
            tsResult.js.pipe(gulp.dest(baseLibPath))
        ]);
    }
}

var componentBuildTasks = ['utils','synkHorizontalScroll','scrollToPaddingRight','contentUpdated', 'aGridPager','aGridColumnResizer', 'aGridColumn', 'aGridButton', 'aGridBody', 'aGridBottom'];

componentBuildTasks.forEach(function (item) {
    gulp.task(item, buildComponent(item));
});

gulp.task("buildRoot",componentBuildTasks,  buildComponent());

gulp.task('cleanLib', function () {
    return gulp.src('./lib')
        .pipe(rimraf());
});

gulp.task('build', ['buildRoot']);