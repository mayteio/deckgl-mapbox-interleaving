import React, { useEffect, useState } from "react";

// core deck.gl/mapbox APIs
import DeckGL from "@deck.gl/react";
import { MapboxLayer } from "@deck.gl/mapbox";
import { StaticMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// our deck.gl/mapbox APIs
import { useDeckGL } from "./DeckGLProvider";
import { useMapbox } from "./MapboxProvider";
import { useViewport, useUpdateViewport } from "./ViewportProvider";
import { DECKGL_LAYER_PREFIX } from "./constants";

/**
 * A component for displaying DeckGL & Mapbox together with ease.
 * @description use the hooks `useDeckGL` and `useMapbox` or pass any children to create visualisations.
 * @component
 */
export const DeckGLMapboxMap = ({
  /** The component children */
  children,
  /** A default viewport to start at */
  defaultViewport,
  /** The map height @required */
  height,
  /** The mapbox token to use */
  mapboxToken,
  /** Map style passed to the react-map-gl StaticMap node */
  mapStyle,
  /** Props passed to the react-map-gl StaticMap node */
  staticMapProps = {},
  /** The map width @required */
  width,
  ...props
}) => {
  /** Store deck.gl instance and gl context in state */
  const [deck, setDeck] = useState(undefined);
  const [gl, setGl] = useState(undefined);

  /** Grab deck.gl layers from the DeckGLProvider provider */
  const [layers] = useDeckGL();

  /** Grab our mapbox instance */
  const mapbox = useMapbox();

  /**
   * Interleave deck.gl layers with mapbox.
   * See https://deck.gl/gallery/mapbox-layer
   */
  useEffect(() => {
    // return early if we don't have everything we need
    if (!deck || !gl || !mapbox) return;

    if (layers.length) {
      // get arrays of layer IDs
      const mapboxLayerIds = Object.keys(mapbox.style._layers).filter((id) =>
        id.startsWith(DECKGL_LAYER_PREFIX)
      );
      const deckLayerIds = layers.map((l) => l.id);

      // toggle visibility of mapbox layers
      for (const mapboxLayerId of mapboxLayerIds) {
        mapbox
          .getLayer(mapboxLayerId)
          .setLayoutProperty(
            "visibility",
            deckLayerIds.includes(mapboxLayerId) ? "visible" : "hidden"
          );
      }

      // create deck layers that don't exist in mapbox
      const missingDeckLayers = layers.filter(
        (l) => !mapboxLayerIds.includes(l.id)
      );

      for (const layer of missingDeckLayers) {
        mapbox.on("load", () =>
          mapbox.addLayer(
            new MapboxLayer({ id: layer.id, deck }),
            layer.props.beforeId
          )
        );
      }
    }
  }, [deck, gl, layers, mapbox]);

  const viewport = useViewport();
  const setViewport = useUpdateViewport();

  useEffect(() => void defaultViewport && setViewport(defaultViewport), [
    defaultViewport,
    setViewport,
  ]);

  return (
    <DeckGL
      controller
      height={height}
      layers={layers}
      onViewStateChange={({ viewState }) => setViewport(viewState)}
      onWebGLInitialized={setGl}
      ref={(ref) => ref && setDeck(ref.deck)}
      viewState={viewport}
      width={width}
      {...props}
    >
      <StaticMap
        height={height}
        gl={gl && layers.length ? gl : undefined}
        mapboxApiAccessToken={
          mapboxToken || process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN
        }
        mapStyle={mapStyle}
        onLoad={(e) =>
          e.target.on(
            "load",
            () => staticMapProps.onLoad && staticMapProps.onLoad(e)
          )
        }
        width={width}
      >
        {children}
      </StaticMap>
    </DeckGL>
  );
};
