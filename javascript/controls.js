"use strict";

import io from "socket.io-client";

const ORIGIN = window.location.origin;

export function controls () {
    let socket = io( `${ORIGIN}/add-controls` );

    window.addEventListener( "keydown", function ( e ) {
        socket.emit( "new-event", { key: e.key } );
    } );
}