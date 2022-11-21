

    var app;

    require([
    "esri/WebMap",
    "esri/config",
    "esri/Map",
    "esri/Basemap",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/widgets/Search",
    "esri/core/watchUtils",
    "dojo/query",
    "esri/widgets/BasemapGallery",
    "esri/widgets/CoordinateConversion",
    "esri/widgets/Bookmarks",
    "esri/widgets/LayerList",
    "esri/widgets/Legend",
    "esri/widgets/Locate",
    "esri/widgets/Print",
    "esri/widgets/Sketch",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Extent",
    "esri/config",

      // Calcite-maps
      "calcite-maps/calcitemaps-v0.10",
      "calcite-maps/calcitemaps-arcgis-support-v0.10",

      // Bootstrap
      "bootstrap/Collapse", 
      "bootstrap/Dropdown",
      "bootstrap/Tab",      

      "dojo/domReady!"
    ], function(WebMap, esriConfig, Map, Basemap, MapView, SceneView, Search, watchUtils, query, BasemapGallery, CoordinateConversion,
    Bookmarks, LayerList, Legend, Locate, Print, Sketch, GraphicsLayer, Extent,esriConfig,
    CalciteMaps, CalciteMapsArcGIS) {
       
          
    
    
    // App
    app = {
        zoom: 6,
        center: [-74.912469, -9.310016],
        basemap: "hybrid",
        viewPadding: {
            top: 50, bottom: 0
        },
        uiPadding: {
            top: 150, bottom: 15
        },
        map: null,
        mapView: null,
        sceneView: null,
        activeView: null,
        searchWidgetNav: null,
        containerMap: "mapViewDiv",
        containerScene: "sceneViewDiv"
    };

  

    ////esriConfig.portalUrl = "https://geocatmin.ingemmet.gob.pe/portal/"
    //app.map = new WebMap({
    //    portalItem: { id: "f5280ded12814f4da2e4d3647cea54dd" },
    //    ground: "world-elevation"
    //});
    
    //esriConfig.portalUrl = "https://geocatmin.ingemmet.gob.pe/portal"

    // Map 
app.map = new WebMap({
    portalItem: { id: '94bd880808d94a5fb38b5bebb6d572ea'},
        //basemap: app.basemap,
        ground: "world-elevation"
      });

      
    
    //// Map
    //app.map = new Map({
    //    basemap: app.basemap,
    //    ground: "world-elevation"
    //});

    
    // 2D View
    app.mapView = new MapView({
        container: app.containerMap, // deactivate
        map: app.map,
        zooom: app.zoom,
        center: app.center,
        padding: app.viewPadding,
        ui: {
            //components: ["zoom", "compass", "attribution"],
            padding: app.uiPadding
        }
    });

   


    // 3D View
    app.sceneView = new SceneView({
        container: null,//app.containerScene, // activate
        map: app.map,
        zoom: app.zoom,
        center: app.center,
        padding: app.viewPadding,
        ui: {
            padding: app.uiPadding
        }
    });


    // app.sceneView= new Extent({
    //     xmin: -67.965613,
    //     ymin: -18.824816,
    //     xmax: -81.859325,
    //     ymax: 0.204784,
    //     spatialReference: 4326
    // });
    

 // Set active view
 
    // Active view is scene
    //setActiveView(app.sceneView);
    setActiveView(app.mapView);

  // app.activeView = app.mapView;

    // Create search widget
    app.searchWidgetNav = new Search({
        container: "searchNavDiv",
        view: app.activeView
    });

    // Wire-up expand events
    CalciteMapsArcGIS.setSearchExpandEvents(app.searchWidgetNav);
    CalciteMapsArcGIS.setPopupPanelSync(app.mapView);
    CalciteMapsArcGIS.setPopupPanelSync(app.sceneView);

    // Menu UI - change Basemaps
    query("#selectBasemapPanel").on("change", function (e) {
        app.mapView.map.basemap = e.target.options[e.target.selectedIndex].dataset.vector;
        app.sceneView.map.basemap = e.target.value;
    });

    // Tab UI - switch views
    query(".calcite-navbar li a[data-toggle='tab']").on("click", function (e) {
        if (e.target.text.indexOf("Map") > -1) {
            syncViews(app.sceneView, app.mapView);
            setActiveView(app.mapView);
        } else {
            syncViews(app.mapView, app.sceneView);
            setActiveView(app.sceneView);
        }
        syncSearch(app.activeView);
    });

    ////Usuario conectados
    //var userActivity = $.connection.userActivityHub;

    //// Create a function that the hub can call back to display messages.
    //userActivity.client.updateUsersOnlineCount = function (count) {
    //    // Add the message to the page.
    //    $('#spUsuarios').text(count);
    //};


    // Views
    function syncViews(fromView, toView) {
        var viewPt = fromView.viewpoint.clone();
        fromView.container = null;
        if (fromView.type === "3d") {
            toView.container = app.containerMap;
        } else {
            toView.container = app.containerScene;
        }
        toView.viewpoint = viewPt;
        toView.padding = app.viewPadding;
    }

    // Search Widget
    function syncSearch(view) {
        app.searchWidgetNav.view = view;
        if (app.searchWidgetNav.selectedResult) {
            watchUtils.whenTrueOnce(view, "ready", function () {
                app.searchWidgetNav.autoSelect = false;
                app.searchWidgetNav.search(app.searchWidgetNav.selectedResult.name);
                app.searchWidgetNav.autoSelect = true;
            });
        }
    }

    // Active view
    function setActiveView(view) {
        app.activeView = view;
    }


    //Widgets
    var locateBtn = new Locate({
        view: app.activeView
    });

    // Add the locate widget to the top left corner of the view
    app.activeView.ui.add(locateBtn, {
        position: "top-left"
    });
    //Scalebar
    //var scaleBar = new ScaleBar({
    //    view: app.activeView,
    //});

    //app.activeView.ui.add(scaleBar, {
    //    position: "bottom-left"
    //});

    //BasesMaps
    var basemapGallery = new BasemapGallery({
        view: app.activeView,
        container: basemapPanelDiv
    });

    ////BookMark
    //var bookmarks = new Bookmarks({
    //    view: app.activeView,
    //    // allows bookmarks to be added, edited, or deleted
    //    editingEnabled: true,
    //    container: BookmarksPanelDiv
    //});

    //Cordinate Converion
    var ccWidget = new CoordinateConversion({
        view: app.activeView,
        container: CoordinateConversionPanelDiv
    });

    //LayerList
    var layerList = new LayerList({
        view: app.activeView,
        container: LayerListPanelDiv
    });


    ///leyenda
    var legend = new Legend({
        view: app.activeView,
        container: LegendPanelDiv,
        style: "card"
    });

    //Print
    var print = new Print({
        view: app.activeView,
        container: PrintPanelDiv
    });
    //Sketch
    //const sketch = new Sketch({
    //    view: app.activeView,
    //    container: SketchPanelDiv
    //});
    //// Add the widget to the top-right corner of the view
    //app.activeView.ui.add(basemapGallery, {
    //    position: "top-right"
    //});
    });

  
  