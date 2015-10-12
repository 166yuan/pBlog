	var gulp = require('gulp')
		csslint = require('gulp-csslint'),
		minifycss = require('gulp-minify-css'),
		jshint = require('gulp-jshint'),
		concat = require('gulp-concat'),
		copy = require('gulp-copy'),
		rename   = require('gulp-rename'),
		autoprefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		browserSync = require('browser-sync');
	// 校验js
	
	gulp.task('jshint', function(){
		return gulp.src('public/js/*.js')
			.pipe(jshint())
			.pipe(jshint.reporter());
	});

	gulp.task("minjs", function(){
		return gulp.src("public/js/*.js")
			.pipe(concat('all.js'))
			.pipe(gulp.dest("../build"))
			.pipe(uglify({mangle : false}))
			.pipe(rename({
				extname : ".min.js"
			}))
			.pipe(gulp.dest("public/js/build"));
	});

	gulp.task("csslint", function(){
		return gulp.src("public/css/*.css")
			.pipe(csslint())
			.pipe(csslint.reporter());
	});

	gulp.task("minicss", function(){
		return gulp.src("public/css/*.css")
			.pipe(autoprefixer({
				browsers: ['last 2 versions', 'Firefox > 20', 'Android >= 2.3', 'Opera > 10', "Chrome >= 30"],
				cascade: false
			}))
			.pipe(concat('all.css'))
			.pipe(rename({
				extname: ".min.css"
			}))
			.pipe(minifycss())
			.pipe(gulp.dest("public/css/build"))
			.pipe(gulp.dest("public/css/build"));
	});

	gulp.task("css", function(){
		gulp.run("minicss");
	});

	gulp.task("js", function(){
		gulp.run("jshint");
		gulp.run("minjs");
	});

	// gulp.task('browser-sync', function() {
	//     browserSync({
	//         server: {
	//             baseDir: '166yuan.github.io/_site'
	//         }
	//     });
	// });
	
	gulp.task('default' ,function(){
		gulp.run("css");
		gulp.run("js");
		gulp.run("browser-sync");
		gulp.watch("public/js/*.js",['jshint', 'minjs']);
		gulp.watch("public/css/*.css",['minicss']);
	});

