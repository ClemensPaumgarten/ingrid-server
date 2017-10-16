"use strict";

import { stream } from "./stream/stream";
import { controls } from "./controls";


function app () {
    stream();
    controls();
}

app();