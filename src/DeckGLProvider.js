import React, { createContext, useContext, useReducer } from "react";
import { DECKGL_LAYER_PREFIX } from "./constants";

/** Create the deck.gl context to store layers */
const DeckGLContext = createContext(undefined);

export const DeckGLProvider = ({ children }) => {
  /** Store layers in state */
  const [layers, setLayers] = useReducer((state, action) => {
    // call the action if it's a function so we can access state in the action
    const nextValue = typeof action === "function" ? action(state) : action;
    return nextValue.map((layer) => {
      // prefix all custom layers so we can identify them
      if (layer && !layer.id.startsWith(DECKGL_LAYER_PREFIX))
        layer.id = DECKGL_LAYER_PREFIX + layer.id;
      return layer;
    });
  }, []);

  return (
    <DeckGLContext.Provider value={[layers, setLayers]}>
      {children}
    </DeckGLContext.Provider>
  );
};

/** Hook to access the DeckGL state */
export const useDeckGL = () => {
  const context = useContext(DeckGLContext);
  if (!context) throw Error("Not inside <DeckGLProvider />");
  return context;
};
