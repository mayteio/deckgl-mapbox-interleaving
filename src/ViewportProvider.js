import React, { createContext, useContext, useState } from "react";

import { PACHAMA_HQ } from "./constants";

/** Generate the MapContext */
const ViewportContext = createContext(undefined);
const UpdateViewportContext = createContext(undefined);

/**
 * @description A provider that manages viewport state and bounds
 * @prop {ViewportProps} defaultViewport default viewport in case none provided
 */
export const ViewportProvider = ({
  children,
  defaultViewport = PACHAMA_HQ,
}) => {
  /** Store our viewport and bounds in state */
  const [viewport, setViewport] = useState(defaultViewport);

  return (
    <ViewportContext.Provider value={viewport}>
      <UpdateViewportContext.Provider value={setViewport}>
        {children}
      </UpdateViewportContext.Provider>
    </ViewportContext.Provider>
  );
};

/** A hook to grab the viewport context */
export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (!context) throw Error("Not inside <MapProvider />");
  return context;
};

/** A hook to grab the viewport updater context */
export const useUpdateViewport = () => {
  const context = useContext(UpdateViewportContext);
  if (!context) throw Error("Not inside <MapProvider />");
  return context;
};
