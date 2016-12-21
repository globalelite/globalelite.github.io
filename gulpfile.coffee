gulp = require 'gulp'
$ = require('gulp-load-plugins')(
  pattern: ['gulp-*', '*']
  rename:
    'imagemin-pngquant': 'pngquant'
)

gulp.task 'copy:config-files', ->
  gulp.src('src/{CNAME,.nojekyll}')
    .pipe(gulp.dest('.tmp'))

gulp.task 'copy:files', ->
  gulp.src('src/**/*.{html,js,css,json,png,jpg,gif,mp3}')
    .pipe(gulp.dest('.tmp'))

gulp.task 'build:pug', ->
  gulp.src('src/**/*.{pug,jade}')
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
  gulp.watch 'src/**/*.{html,js,css,json}', ['copy:files']
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
  gulp.src('.tmp/{.*,**/*}')
    .pipe(htmlFilter = $.filter('**/*.html', restore: true))
    .pipe($.htmlmin(
      removeComments: true
      collapseWhitespace: true
      collapseBooleanAttributes: true
      useShortDoctype: true
      removeScriptTypeAttributes: true
      removeStyleLinkTypeAttributes: true
    ))
    .pipe(htmlFilter.restore)
    .pipe(cssFilter = $.filter('**/*.css', restore: true))
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(jsFilter = $.filter('**/*.js', restore: true))
    .pipe($.uglify(preserveComments: 'license'))
    .pipe(jsFilter.restore)
    .pipe(imgFilter = $.filter('**/*.{png,jpg,gif}', restore: true))
    .pipe($.imagemin(
      progressive: true
      svgoPlugins: [removeViewBox: false]
      use: [$.pngquant()]
    ))
    .pipe(imgFilter.restore)
    .pipe(gulp.dest('dist'))

gulp.task 'deploy', ['build:dist'], ->
  gulp.src('dist/**', dot: true)
    .pipe($.ghPages())
