"use strict";

import io from "socket.io-client";
import ss from "socket.io-stream";

// const Origin = window.location.origin;

export default function stream () {
    let socket = io( "http://localhost:8080/downstream", {} );
    // let stream = ss.createStream();
    let image = document.querySelector( "#stream" );

    socket.on( "connect", function () {
        ss( socket ).on( "downstream", function ( stream ) {
            console.log( "downstream incoming" );
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
}