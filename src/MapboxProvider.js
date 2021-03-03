import React, { useContext } from "react";
import { MapContext } from "react-map-gl";

/** Create pass-through provider to match our API */
export const MapboxProvider = ({ children }) => (
  <MapContext.Provider>{children}</MapContext.Provider>
);

/** Convenience hook to consume the mapbox instance */
export const useMapbox = () => {
  const context = useContext(MapContext);
  if (context === undefined) throw Error("Not inside <MapboxProvider />");
  return context.map;
};
