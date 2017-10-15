const ss = require( "socket.io-stream" );

let upstreamHandler;

exports.mount = function ( io ) {
    if ( ! upstreamHandler ) {
        upstreamHandler = new UpstreamHandler( io );
    }

    return upstreamHandler;
};

class UpstreamHandler {
    constructor( io ) {
        this.io = io;
        this.downstreamHandler;

        this.openConnection();
    }

    setDownstreamHandler( downstreamHandler ) {
        this.downstreamHandler = downstreamHandler;
    }

    openConnection() {
        this.io.of( "upstream" ).on( "connection", ( socket ) => {
            ss( socket ).on( "upstream", ( stream ) => {
                if ( this.downstreamHandler ) {
                    this.streamToClient( stream );
                }
            } );
        } );
    }

    streamToClient( stream ) {
        this.downstreamHandler.getDownstreams().forEach( downstream => {
            stream.pipe( downstream );
        } );
    }
}

