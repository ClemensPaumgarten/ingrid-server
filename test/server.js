const supertest   = require( "supertest" );
const io          = require( "socket.io-client" );
const ss          = require( "socket.io-stream" );
const fs          = require( "fs" );
const rimraf      = require( "rimraf" );
const bufferEqual = require( "buffer-equal" );
const server      = require( "../index" );

describe( "Server", function() {

    it( "should get index.html", function( done ) {

        supertest( server.app )
            .get( "/" )
            .expect( 200 )
            .expect( "Content-Type", "text/html; charset=utf-8" )
            .end( done );

    } );

    it( "should accpet upload socket", function( done ) {

        const filepath = __dirname + "/mocks/image.png";

        let socket = io( "http://localhost:8080/upstream" );
        let stream = ss.createStream();

        ss( socket ).emit( "upstream", stream );

        let readable = fs.createReadStream( filepath );

        readable.on( "end", done );
        readable.pipe( stream );

    } );

    it( "should allow clients to connect to downstream", function( done ) {

        let socket = io( "http://localhost:8080/downstream" );

        socket.on( "connect", function() {
            socket.disconnect();
            done();
        } );

    } );

    describe( "end to end", function() {

        beforeEach( function() {
            fs.mkdirSync( __dirname + "/tmp" );
        } );

        afterEach( function( done ) {
            rimraf( __dirname + "/tmp", done );
        } );

        it( "should pipe image up and down the stream", function( done ) {

            const filepath = __dirname + "/mocks/image.png";
            const upstreamFile = fs.readFileSync( filepath );

            let upsocket    = io( "http://localhost:8080/upstream" );
            let downsocket  = io( "http://localhost:8080/downstream" );

            downsocket.on( "connect", function() {
                ss( downsocket ).on( "downstream", function( stream ) {
                    let targetPath = __dirname + "/tmp/image.png";
                    let writable = fs.createWriteStream( targetPath );

                    stream.pipe( writable );

                    writable.on( "finish", function() {
                        downsocket.disconnect();

                        const downStreamFile = fs.readFileSync( targetPath );

                        if ( bufferEqual( upstreamFile, downStreamFile ) ) {
                            done();
                        }
                    } );
                } );
            } );

            let upstream = ss.createStream();

            ss( upsocket ).emit( "upstream", upstream );

            fs.createReadStream( filepath ).pipe( upstream );

        } );

    } );

} );