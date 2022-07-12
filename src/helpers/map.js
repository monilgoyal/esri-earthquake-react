import WebMap from "@arcgis/core/WebMap"
import MapView from "@arcgis/core/views/MapView";
import Legend from "@arcgis/core/widgets/Legend";
import Expand from "@arcgis/core/widgets/Expand";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer"
import esriConfig from "@arcgis/core/config";
esriConfig.apiKey = process.env.REACT_APP_ARCGIS_API_KEY


const noop = () => {};



//Create Data layer

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const earthquakesLayer = new GeoJSONLayer({
    url: url,
    copyright: "USGS Earthquakes",
    // screenSizePerspectiveEnabled: false,
    title: "Earthquakes in the last 30 days",
    popupTemplate: {
        title: "Earthquake Info",
        content: "Magnitude <b>{mag}</b> {type} hit <b>{place}</b> on <b>{time}</b>",
        fieldInfos: [{
            fieldName: "time",
            format: {
                dateFormat: "short-date-short-time",
            },
        }, ],
    },
});


// Create  webmap object
export const webmap = new WebMap({
    basemap: "arcgis-topographic",
    layers: [earthquakesLayer]
});


// Add mapview to webmap
export const view = new MapView({
    map: webmap,
    zoom: 3,
    center: [-118.805, 34.027]
});



// function to style symbol
const createSymbol = (color) => {
    return {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        style: "circle",
        color,
        size: "16px",
    };
}

// create renderer object
const renderer = {
    type: "class-breaks",
    field: "mag",
    legendOptions: {
        title: "Legend",
    },
    classBreakInfos: [{
        minValue: -2,
        maxValue: 5,
        symbol: createSymbol([255, 0, 0]),
        label: "Magnitude < 5",
    }, {
        minValue: 5,
        maxValue: 7,
        symbol: createSymbol([0, 0, 255]),
        label: "Magnitude between 5 and 7",
    }, {
        minValue: 7,
        maxValue: 10,
        symbol: createSymbol([0, 255, 0]),
        label: "Magnitude larger than 7",
    }, ],
};

earthquakesLayer.renderer = renderer;


// legend
export const legend = new Legend({
    view: view,
})


//add expanded legend to view
view.ui.add(new Expand({
    content: legend,
    expanded: true
}), "top-right");


//function to add view to container
export const initialize = (container) => {
    view.container = container;
    view
        .when()
        .then(_ => {
            console.log("Map and View are ready");
        })
        .catch(noop);
    return () => {
        view.container = null;
    };
};