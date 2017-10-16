"use strict";

import io from "socket.io-client";
import ss from "socket.io-stream";

const ORIGIN = window.location.origin;

export  function stream () {
    let socket = io( `http://${ORIGIN}/downstream`, {} );
    let image = document.querySelector( "#stream" );

    socket.on( "connect", function () {
        if ( ! socket ) return;

        ss( socket ).on( "downstream", function ( stream ) {
            console.log( "next downstream" );
            let binaryString = "";

            stream.on( "data", function ( data ) {
                for ( let i = 0, max = data.length; i < max; i++ ) {
                    binaryString += String.fromCharCode( data[ i ] );
                }
            } );

            stream.on( "end", function () {
                image.setAttribute( "src", `data:image/png;base64,${window.btoa( binaryString )}` );
                binaryString = "";
            } );
        } );
    } );

    socket.on( "disconnect", function () {
        socket = null;
    } );
}