var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var jshint = require("gulp-jshint");
var dir_path = './';

var files = {
	css: {
		vendor: [
			'bower_components/bootstrap/dist/css/bootstrap.min.css',
			'bower_components/font-awesome/css/font-awesome.min.css',
			'bower_components/fullpage.js/dist/jquery.fullpage.min.css'
		],
		custom: [dir_path+'assets/css/*.css'],
		sassFile: [dir_path+'assets/styles/*.scss']
	},
	js: {
		vendor: [
			'bower_components/jquery/dist/jquery.min.js',
			'bower_components/bootstrap/dist/js/bootstrap.min.js',
			'bower_components/fullpage.js/dist/jquery.fullpage.min.js'
		],
		custom: [
			'./assets/js/app.js'
		]
	}
};

gulp.task('vendorcss', function() {
	return gulp.src(files.css.vendor)
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('customcss', ['sass'], function() {
	return gulp.src(files.css.custom)
		.pipe(minifyCSS())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('vendorjs', function() {
	return gulp.src(files.js.vendor)
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('customjs', function() {
     return gulp.src(files.js.custom)
         .pipe(jshint())
         .pipe(jshint.reporter('default'))
         .pipe(concat('app.js'))
         .pipe(gulp.dest('dist/js'))
         .pipe(uglify())
         .pipe(concat('app.min.js'))
         .pipe(gulp.dest(dir_path+'dist/js'));
 });


gulp.task('sass', function() {
	return gulp.src(files.css.sassFile)
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest(dir_path+'assets/css'));
});

gulp.task('moveCss', function() {
	return gulp.src(['bower_components/bootstrap/dist/css/bootstrap.min.css.map'])
		.pipe(gulp.dest('dist/css'));
});

gulp.task('moveFonts', function() {
	return gulp.src(['bower_components/bootstrap/dist/fonts/*',
		'bower_components/font-awesome/fonts/*',
		'assets/styles/fonts/**/*'
		])
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('moveImages', function() {
	return gulp.src([dir_path+'assets/images/*'])
		.pipe(gulp.dest('dist/images'));
});

gulp.task('compact', [
	'customcss',
	'vendorcss',
	'vendorjs',
	'customjs',
	'moveCss',
	'moveFonts',
	'moveImages'
]);

gulp.task('watchfiles', function() {
	gulp.watch(files.css.sassFile, ['customcss']);
	gulp.watch(files.js.custom, ['customjs']);
});

gulp.task('default', ['compact']);

gulp.task('watch', ['compact', 'watchfiles']);
