import React from "react";
import ReactDom from "react-dom";

export default function BootstrapReactRoot(Bootstrap: React.ReactType) {
  // Root document styles
  document.documentElement.style.height = "100%";
  document.documentElement.style.width = "100%";
  document.body.style.height = "100%";
  document.body.style.margin = "0";
  document.body.style.width = "100%";
  document.body.style.height = "100%";
  document.body.style.position = "relative";

  const reactRoot = document.createElement("div");
  document.body.appendChild(reactRoot);

  ReactDom.render(<Bootstrap />, reactRoot);
}