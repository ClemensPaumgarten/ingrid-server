"use strict";

let events = [];
let cartSocket;

exports.mount = function ( io ) {
    openSockets ( io );
};

function openSockets ( io ) {
    io.of( "add-controls" ).on( "connection", socket => {
        socket.on( "new-event", ( eventData ) => {
            let firstEvent = events.length === 0;

            events.push( eventData );

            if ( firstEvent ) {
                sendEventsToCart();
            }
        } );
    } );

    io.of( "receive-controls" ).on ( "connection", socket => {
        cartSocket = socket;
    } );
}

function sendEventsToCart () {
    if ( cartSocket ) {
        while ( events.length > 0 ) {
            cartSocket.emit( "next-event", events.pop() );
        }
    }
}