"use strict";

let cartSocket;

function openSockets ( io ) {
    io.of( "add-controls" ).on( "connection", socket => {
        socket.on( "new-event", function( eventData ) {
            if ( cartSocket ) {
                cartSocket.emit( "next-event", eventData );
            }
        } );
    } );

    io.of( "receive-controls" ).on( "connection", function( socket ) {
        cartSocket = socket;
    } );
}

exports.mount = function ( io ) {
    openSockets ( io );
};
