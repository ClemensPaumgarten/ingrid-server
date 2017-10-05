const gulp        = require( "gulp" );
const babelify    = require( "babelify" );
const browserify  = require( "browserify" );
const source      = require( "vinyl-source-stream" );
const cleanCSS    = require( "gulp-clean-css" );
const sass        = require( "gulp-sass" );

gulp.task( "scripts", function() {
    return browserify( "javascript/main.js", {
            debug: true
        } )
        .transform( babelify, {  "presets": [ "env" ] } )
        .bundle()
        .on( "error", function( error ) {
            console.log( error );
            this.emit( "end" );
        } )
        .pipe( source( "main.js" ) )
        .pipe( gulp.dest( "assets/javascript/" ) );
} );

gulp.task( "styles", function() {
    return gulp.src( "scss/*.scss" )
    .pipe( sass().on( "error", sass.logError ) )
    .pipe( cleanCSS() )
    .pipe( gulp.dest( "assets/stylesheets" ) );
} );

gulp.task( "watch", function() {
    gulp.watch( "javascript/**/*.js", [ "scripts" ] );
    gulp.watch( "scss/**/*.scss", [ "styles" ] );
} );

gulp.task( "default", [ "scripts", "styles", "watch" ] );