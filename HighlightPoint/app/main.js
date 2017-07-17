define(["require", "exports", "esri/WebScene", "esri/views/SceneView", "esri/Color"], function (require, exports, WebScene, SceneView, Color) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const webscene = new WebScene({
        portalItem: {
            id: "475a7161ed194460b5b52654e29581a2"
        }
    });
    const view = new SceneView({
        map: webscene,
        container: "viewDiv",
        highlightOptions: {
            color: new Color([255, 242, 58]),
            fillOpacity: 0.4,
            haloOpacity: 0.25
        }
    });
    // these two highlight handlers are used for selection and hovering over features 
    webscene.load().then(() => {
        // Get layer from scene view
        const stationLayer = webscene.layers.getItemAt(1);
        // highlight is set on the layerview so we need to detect
        // when the layer view is ready
        //let highlightSelect: any;
        view.whenLayerView(stationLayer).then(lyrView => {
            const queryStations = stationLayer.createQuery();
            const filterButtons = document.querySelectorAll("button");
            let handler = null;
            [...document.querySelectorAll("button")].forEach(filterButton => {
                filterButton.addEventListener("click", (event) => {
                    queryStations.where = `nom = '${filterButton.innerHTML}'`;
                    stationLayer.queryFeatures(queryStations).then((result) => {
                        const feature = result.features[0];
                        // Highlight feature using the objectid  then center the view
                        if (handler) {
                            handler.remove();
                        }
                        handler = lyrView.highlight(feature.attributes["OBJECTID"]);
                        view.goTo({
                            target: feature.geometry,
                            tilt: 70
                        }), {
                            duration: 2000,
                            easing: "in-out-expo"
                        };
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=main.js.map