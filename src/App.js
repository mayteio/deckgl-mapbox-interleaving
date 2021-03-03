import { useEffect } from "react";
import { DeckGLMapboxMap } from "./DeckGLMapboxMap";
import { useDeckGL } from "./DeckGLProvider";

import { GeoJsonLayer } from "@deck.gl/layers";
import boundary from "./jari-para.json";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicGFjaGFtYSIsImEiOiJjam5xbWY4ZW8wOHhpM3FwaHN6azYzMXZzIn0.bGR3tnhiYFvPwVyU0WHjcA";
const MAPBOX_STYLE = `mapbox://styles/mapbox/satellite-streets-v11`;

function App() {
  const [, setLayers] = useDeckGL();
  useEffect(
    () =>
      void setLayers([
        new GeoJsonLayer({
          id: "projectArea-layer",
          data: boundary,
          stroked: true,
          filled: true,
          extruded: false,
          lineWidthScale: 30,
          lineWidthMinPixels: 4,
          lineWidthMaxPixels: 6,
          getFillColor: [250, 250, 250, 30],
          getLineColor: [250, 250, 250],
          getLineWidth: 4,
          beforeId: "waterway-label",
        }),
      ]),
    [setLayers]
  );

  return (
    <DeckGLMapboxMap
      mapboxToken={MAPBOX_TOKEN}
      mapStyle={MAPBOX_STYLE}
      width="100vw"
      height="100vh"
    />
  );
}

export default App;
