var gulp = require('gulp'),

	wiredep = require('wiredep').stream,

	sass = require('gulp-sass'),

	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),

	connect = require('gulp-connect-multi')(),

	karma = require('karma').server;

gulp.task('wiredep', function() {

	gulp.src('./src/index.html')
		.pipe(wiredep({
			cwd: '.'
		}))
		.pipe(gulp.dest('./src'));

	gulp.src('./src/scss/main.scss')
		.pipe(wiredep({
			cwd: '.'
		}))
		.pipe(gulp.dest('./src/scss'));

});

gulp.task('connect', connect.server({
	root: ['./src'],
	port: 1337,
	livereload: true,
	open: {
		file: 'index.html',
		browser: 'chrome'
	}
}));

gulp.task('html', function() {
	gulp.src('./src/index.html')
		.pipe(connect.reload());
});

gulp.task('js', function() {
	gulp.src('./src/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(connect.reload());
});

gulp.task('scss', function() {
	gulp.src('./src/scss/*.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(gulp.dest('./src/css'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('./src/index.html', ['html']);
	gulp.watch('./src/js/*.js', ['js']);
	gulp.watch('./src/scss/*.scss', ['scss']);

});


gulp.task('default', ['wiredep', 'connect', 'watch']);