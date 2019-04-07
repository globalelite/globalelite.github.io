gulp = require 'gulp'
$ = require('gulp-load-plugins')(
  pattern: ['gulp-*', '*']
  rename:
    'imagemin-pngquant': 'pngquant'
    'imagemin-mozjpeg': 'mozjpeg'
)

gulp.task 'copy:config-files', ->
  gulp.src('src/{CNAME,.nojekyll}')
    .pipe(gulp.dest('.tmp'))

gulp.task 'copy:files', ->
  gulp.src(['src/**/*.*', '!src/**/*.{pug,jade,coffee,styl}'])
    .pipe(gulp.dest('.tmp'))

gulp.task 'build:pug', ->
  gulp.src('src/**/!(_)*.{pug,jade}')
    .pipe($.plumber())
    .pipe($.pug())
    .pipe($.plumber.stop())
    .pipe(gulp.dest('.tmp'))

gulp.task 'build:coffee', ->
  gulp.src('src/**/*.coffee')
    .pipe($.plumber())
    .pipe($.coffee(bare: true))
    .pipe($.plumber.stop())
    .pipe(gulp.dest('.tmp'))

gulp.task 'build:stylus', ->
  gulp.src('src/**/*.styl')
    .pipe($.plumber())
    .pipe($.stylus())
    .pipe($.autoprefixer())
    .pipe($.plumber.stop())
    .pipe(gulp.dest('.tmp'))

gulp.task 'build', [
  'copy:config-files'
  'copy:files'
  'build:pug'
  'build:coffee'
  'build:stylus'
]

gulp.task 'watch', ['build'], ->
  gulp.watch 'src/**/*.{html,js,css,json,pde}', ['copy:files']
  gulp.watch 'src/**/*.{pug,jade}', ['build:pug']
  gulp.watch 'src/**/*.coffee', ['build:coffee']
  gulp.watch 'src/**/*.styl', ['build:stylus']
  return

gulp.task 'serve', ['watch'], ->
  gulp.src('.tmp')
    .pipe($.webserver(
      livereload: true
    ))
  return

gulp.task 'build:dist', ['build'], ->
  gulp.src('.tmp/**/{.*,*}')
    .pipe(htmlFilter = $.filter('.tmp/**/*.html', restore: true))
    .pipe($.htmlmin(
      removeComments: true
      collapseWhitespace: true
      collapseBooleanAttributes: true
      useShortDoctype: true
      removeScriptTypeAttributes: true
      removeStyleLinkTypeAttributes: true
    ))
    .pipe(htmlFilter.restore)
    .pipe(cssFilter = $.filter('.tmp/**/*.css', restore: true))
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(jsFilter = $.filter('.tmp/**/*.js', restore: true))
    .pipe($.uglify())
    .pipe(jsFilter.restore)
    .pipe(imgFilter = $.filter('.tmp/**/*.{png,jpg,gif,svg}', restore: true))
    .pipe($.imagemin([
      $.imagemin.gifsicle(interlaced: true)
      $.mozjpeg(progressive: true)
      $.pngquant(floyd: 0, speed: 1)
      $.imagemin.optipng(optimizationLevel: 5)
      $.imagemin.svgo(plugins: [removeViewBox: false])
    ]))
    .pipe(imgFilter.restore)
    .pipe(gulp.dest('dist'))

gulp.task 'deploy', ['build:dist'], ->
  gulp.src('dist/**', dot: true)
    .pipe($.ghPages(branch: 'master'))
