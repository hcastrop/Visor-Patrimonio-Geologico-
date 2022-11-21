
require([
  "esri/views/MapView",
  "esri/WebMap",
  "esri/widgets/Expand",
  "esri/widgets/Locate",
  "esri/widgets/Home",
  "esri/widgets/BasemapGallery",
  "esri/widgets/LayerList",
  "esri/widgets/Legend",
  "dojo/domReady!"
], function (
  MapView, WebMap, Expand,Locate, Home, BasemapGallery,LayerList,Legend
) {

  /************************************************************
   * Creates a new WebMap instance. A WebMap must reference
   * a PortalItem ID that represents a WebMap saved to
   * arcgis.com or an on-premise portal.
   *
   * To load a WebMap from an on-premise portal, set the portal
   * url with esriConfig.portalUrl.
   ************************************************************/
  var webmap = new WebMap({
    portalItem: { // autocasts as new PortalItem()
      id: "94bd880808d94a5fb38b5bebb6d572ea"
    }
  });

  /************************************************************
   * Set the WebMap instance to the map property in a MapView.
   ************************************************************/
  var view = new MapView({
    map: webmap,
    container: "viewDiv",
    constraints: {
      rotationEnabled: false
    }
  });


  var locateBtn = new Locate({
    view: view
  });
  var homeBtn = new Home({
    view: view
  });

  
  view.ui.add(locateBtn, {
    position: "top-left"
  });

  view.ui.add(homeBtn, "top-left");




  /*******************/
  var basemapGallery = new BasemapGallery({
    view: view,
    container: document.createElement("div")
  });

  var layerList = new LayerList({
    view: view,
    container: document.createElement("div")
  });

  var legend = new Legend({
    view: view,
    container: document.createElement("div")
  });
  

  var bgExpand = new Expand({
    view: view,
    content: basemapGallery.container,
    expandIconClass: "esri-icon-basemap"
  });
  view.ui.add(bgExpand, "top-right");

  
  var layerListExpand = new Expand({
    view: view,
    content: layerList.container,
    expandIconClass: "esri-icon-layers"
  });
  view.ui.add(layerListExpand, "top-right");

  var legendListExpand = new Expand({
    view: view,
    content: legend.container,
    expandIconClass: "esri-icon-layer-list"
  });
  view.ui.add(legendListExpand, "top-right");
  
});
