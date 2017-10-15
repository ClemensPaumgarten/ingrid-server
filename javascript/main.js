"use strict";

import { stream } from "./stream/stream";
import { controls } from "./controls";


function app () {
    // downstream test
    stream();
    controls();
}

app();