"use strict";

import io from "socket.io-client";

const Origin = window.location.origin;

export function controls () {
    let socket = io(  `${Origin}/add-controls` );

    window.addEventListener( "keydown", function ( e ) {
        socket.emit( "new-event", { key: e.key } );
    } );
}