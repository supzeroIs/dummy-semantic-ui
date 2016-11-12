var gulp 			= require('gulp');
var browserSync 	= require('browser-sync').create();
// var sass 			= require('gulp-sass');
var autoprefixer 	= require('gulp-autoprefixer');
var htmlmin 		= require('gulp-html-minifier');
var sourcemaps 	= require('gulp-sourcemaps');
var watch 			= require('./semantic/tasks/watch');
var build 			= require('./semantic/tasks/build');
var image 			= require('gulp-image');
var less 			  = require('gulp-less');
var path 			  = require('path');
var gutil       = require('gulp-util');

var LessAutoprefix 	= require('less-plugin-autoprefix');
var autoprefix 		= new LessAutoprefix({ browsers: ['last 2 versions'] });


// import task with a custom task name
gulp.task('watch ui', watch);
gulp.task('build ui', build);

var configs = {
	dis : './dist',
	src : './src' 
}


// browser syc directory
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: './dist'
		}
	});
});





gulp.task('less', function () {
  return gulp.src('./src/less/**/*.less')
    .pipe(less({
    	plugins: 	[autoprefix],
      	paths: 	  	[ path.join(__dirname, 'less', 'includes') ]
      }).on('error', function(err){
        gutil.log(err);
        this.emit('end');
    }))
    .pipe(gulp.dest('./dist/css'))
 	  .pipe(browserSync.stream())
 	;
});



gulp.task('minify', function() {
  gulp.src('./src/*.html')
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});

gulp.task('build:images', function () {
  gulp.src('./src/images/*')
    .pipe(image())
    .pipe(gulp.dest('./dist/img'));
});
 

gulp.task('default' ,['browser-sync'] ,  function() {
	gulp.watch('./src/less/**/*.less' , ['less']).on('error', gutil.log);
 	gulp.watch("./src/*.html" , ['minify']).on('change', browserSync.reload);
 	// gulp.watch("./semantic/src/site/**/*.variables" , ['build ui']).on('change', browserSync.reload);
});

gulp.task('build' , ['minify', 'less' , 'build:images' ,'build ui']);
