const upstream   = require( "./streams/upstream" );
const downstream = require( "./streams/downstream" );
const express    = require( "express" );
const http       = require( "http" );
const socketIO   = require( "socket.io" );
const path       = require( "path" );

const app = express();

let httpServer = http.Server( app ) ;
let io = socketIO( httpServer );

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "pug" );

app.use( express.static( "assets" ) );

app.get( "/", function( request, response ) {
    response.render( "index" );
} );

let upstreamHandler = upstream.mount( io );
let downstreamHandler = downstream.mount( io );

upstreamHandler.setDownstreamHandler( downstreamHandler );

httpServer.listen( 8080, function() {
    console.log( "Ingrid running on 8080" );
} );

exports.app = app;
exports.httpServer = httpServer;

