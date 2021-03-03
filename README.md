# Bug: interleaving deck.gl & mapbox

Interleaving layers between deck.gl & mapbox is possible to make deck.gl layers sit behind mapbox labels.

This works great in development, however, in a production build it causes the map to flicker. My understanding from a [2019 issue about the same problem in development](https://github.com/visgl/deck.gl/issues/3280#issuecomment-505143410) is that this is caused by;

> Deck would not know that the context is being shared unless mapbox tells it so. The flashing you are seeing is because Deck thinks it's the only one drawing into the context, therefore clearing the canvas every time the viewport changes.

I am guessing this has to do with minification during `yarn run build`. I am wondeirng if a certain variable is being renamed that has to have a stable identity?

To reproduce:

1. `$ yarn`
2. `$ yarn start:dev // see working map in local dev mode @ localhost:3000`
3. In another terminal, `$ yarn start:prod // build & serve the app @ localhost:5000`

You'll notice that the map interleaves nicely on local dev, with the label for "Laranjal do Jari" sitting over the GeoJsonLayer, while in the production version the map flickers.

The interleaving happens in `src/DeckGLMapboxMap.js`:

- Line 38:39 store the deck & gl instances
- Line 42 we store a simple array of DeckGL layers
- Line 80:82 we add the MapboxLayers to mapbox
- Line 102:103 setting deck & gl instances in state
- Line 110 passing the gl instance to `<StaticMap />`
