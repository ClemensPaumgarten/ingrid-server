const ss = require( "socket.io-stream" );

let downstreamHandler;

exports.mount = function( io ) {
    if ( ! downstreamHandler ) {
        downstreamHandler = new DownstreamHandler( io );
    }

    return downstreamHandler;
};

class DownstreamHandler {
    constructor( io ) {
        this.io = io;
        this.sockets = [];

        this.openConnection();
    }

    openConnection( connPath = "downstream" ) {
        this.io.of( connPath ).on( "connection", ( socket ) => {
            this.sockets.push( socket );

            socket.on( "disconnect", () => {
                let socketIdx = this.sockets.findIndex( so => ( so.id === socket.id ) );

                this.sockets.splice( socketIdx, 1 );
            } );
        } );
    }

    getDownstreams() {
        let streams = [];
        this.sockets.forEach( socket => {
            let stream = ss.createStream();

            ss( socket ).emit( "downstream", stream );
            streams.push( stream );
        } );

        return streams;
    }
}

