import React from "react";
import ReactDom from "react-dom";

import App from "./App";

const reactRoot = document.createElement("div");

// Root document styles
document.documentElement.style.height = "100%";
document.documentElement.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.position = "relative";

document.body.appendChild(reactRoot);

ReactDom.render(<App />, reactRoot);