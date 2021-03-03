import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DeckGLProvider } from "./DeckGLProvider";
import { MapboxProvider } from "./MapboxProvider";
import { ViewportProvider } from "./ViewportProvider";

import reportWebVitals from "./reportWebVitals";

const DEFAULT_VIEWPORT = {
  latitude: -1,
  longitude: -52.5,
  zoom: 9,
};

ReactDOM.render(
  <DeckGLProvider>
    <MapboxProvider>
      <ViewportProvider defaultViewport={DEFAULT_VIEWPORT}>
        <App />
      </ViewportProvider>
    </MapboxProvider>
  </DeckGLProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
