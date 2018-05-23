import { Injectable } from '@angular/core';
import * as esriLoader from 'esri-loader';
import { ProjectionModel } from '../component/appModel/projectionModel';


@Injectable()
export class EsriMapService {


  
  landUseName: any[];
  acqusitionLayName: any[];
  query_params: any;
  /**
   * DECLARING ESRI MODULES HERE
  */

  map: any;
  view: any;
  Layer: any;
  Collection: any;
  Point: any;
  webMer;
  PortalItem: any;
  FeatureLayer: any;
  Extent: any;
  SpatialReference: any;
  Polygon: any;
  Graphic: any;
  query_params4plot: any;
  Query: any;
  QueryTask: any;
  arrayUtils: any;

  dom: any;
  all: any;
  on: any;

  ESTATE: any;
  LAND_USE: any;
  PLOTS: any;
  ACQUISITION: any;
  ENCROACHMENT: any;
  BLOCKS: any;
  ROAD_NETWORK: any;
  lagosBasemap: any;

  roadNetworkURL: string;
  lcdasURL: string;
  plotURL: string;
  estateURL: string;
  acquisionLayerURL: string;
  landUseUrl: string;

  resultsEstateLyr: any;
  result4PlotQuery: any;
  qTask4EstateLay: any;
  qTask4AcquisitionLay: any;
  qTask4LandUse:any;
  qTask4PlotLay: any;


  estateLayName: any;
  landUsePolygonGraphics: any;




  constructor(
    private _projM: ProjectionModel,
  ) { 

    this._projM = new ProjectionModel();

    const options = {
      url: 'https://js.arcgis.com/4.7/'
    };
    
    // first, we use Dojo's loader to require the map class
    esriLoader.loadModules([
      "esri/config",
      "esri/layers/WebTileLayer",
      "esri/Basemap",
      "esri/widgets/BasemapToggle",

      'esri/Map',
      'esri/views/MapView',
      'esri/layers/Layer',
      'esri/core/Collection',
      'esri/geometry/Point',
      'esri/portal/PortalItem',
      'esri/layers/FeatureLayer',
      'esri/geometry/Extent',
      'esri/geometry/SpatialReference',
      'esri/geometry/Polygon',
      'esri/Graphic',
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query',
      'esri/layers/GraphicsLayer',
      'esri/geometry/support/webMercatorUtils',

      'dojo/_base/array',
      'dojo/dom',
      'dojo/promise/all',
      'dojo/on',
      'dojo/domReady!'
    ], options)
    .then(([
      esriConfig,
      WebTileLayer,
      Basemap,
      BasemapToggle,
      Map,
      MapView,
      Layer,
      Collection,
      Point,
      PortalItem,
      FeatureLayer,
      Extent,
      SpatialReference,
      Polygon,
      Graphic,
      QueryTask,
      Query,
      GraphicsLayer,
      webMercatorUtils,

      arrayUtils,
      dom,
      all,
      on
    ]) => {


      this.dom = dom;
      this.all = all;
      this.on = on;
      this.Graphic = Graphic;
      this.FeatureLayer = FeatureLayer;
      this.webMer = webMercatorUtils;
      this.Query = Query;
      this.QueryTask = QueryTask;
      this.SpatialReference = SpatialReference;
      this.arrayUtils = arrayUtils;
      
      esriConfig.request.corsEnabledServers.push("https://api.mapbox.com");


      // Create a WebTileLayer with a third-party cached service
      var mapBaseLayer = new WebTileLayer({
        urlTemplate: "https://api.mapbox.com/styles/v1/ware185/cjgvzvkmg003v2rljc03ogjbi/tiles/256/{level}/{col}/{row}@2x?access_token=pk.eyJ1Ijoid2FyZTE4NSIsImEiOiJjamV0cmt5cDUyZ25iMnFtdW94Z2dodWRvIn0.jXMFMDsySuhJQG1xMzdTKg",
        copyright: "Source Imagery By: Interspatial Technologies Nigeria Limited"
      });


      // Create a Basemap with the WebTileLayer. The thumbnailUrl will be used for
      // the image in the BasemapToggle widget.
      this.lagosBasemap = new Basemap({
        baseLayers: [mapBaseLayer],
        title: "Lagos Terrain",
        id: "lsterrain",
        thumbnailUrl: "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/409.png"
      });


      // Create graphics layer and symbol to use for displaying the results from esate layer query
      this.resultsEstateLyr = new GraphicsLayer();
      this.result4PlotQuery = new GraphicsLayer();
      this.landUsePolygonGraphics = new GraphicsLayer();

     

      // URL to feature service containing the enterprise database model
      const enterpriseDB = 'https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/eLAND_INFO_MapService/FeatureServer'


      this.ESTATE = new FeatureLayer({
        url: enterpriseDB,
        layerId: 2,
        outFields: ['*'],
        visible: false
      });

      this.LAND_USE = new FeatureLayer({
        url: enterpriseDB,
        layerId: 1,
        outFields: ['*'],
        visible: false
      });

      this.ACQUISITION = new FeatureLayer({
        url: enterpriseDB,
        layerId: 3,
        outFields: ['*'],
        visible: false
      });

      this.ROAD_NETWORK = new FeatureLayer({
        url: enterpriseDB,
        layerId: 0,
        outFields: ['*'],
        visible: false

      });

      this.ENCROACHMENT = new FeatureLayer({
        url: "https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/LAND_RECORD_MANAGEMENT_SYS/FeatureServer/2",
        outFields: ["*"],
        visible: false
      });

      this.PLOTS = new FeatureLayer({
        url: enterpriseDB,
        layerId: 5,
        outFields: ['*'],
        // renderer: plotRenderer,
        visible: false
      });

      // Plot URL
      this.plotURL = 'https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/eLAND_INFO_MapService/FeatureServer/5?token=65irQD2k6VC2KMhRu68EKOKKNwdaqcjYfooNS9uO0QIYwrTUypJBTf8SdvA6HGqG6GTvXZU-eu2BiqbBKL7TT2R7UTr927323zpJId7scgxj1hGRXCWu3B68rYGXxL2uOm1OBcHD84L0qDr2439-_92GKTJE36D2fc-pn4-4oKuSwBfu1vWwex-KnV5o6UI8B32nromQBm9Rnmdh6_sq1NGaEGC-UxAvK9FAAakB67Vrh6XR_6sxvVignzI_AXvt';
      // Road Network URL
      this.roadNetworkURL = 'https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/eLAND_INFO_MapService/FeatureServer/0?token=dYmkESNqFyVrj3IQGHgFe0hELev1Ci8wel8qKo86CncNLm4U5gnIrNc5PvCELPNHYKGdCehdkEAkc4zTNlBLtp9nD2us8BuB7Ud0pT-n0nWgihY10SHlaKVGVSIUM7j11J_Pz5feg0ZyH18r7ciIyo1wI4ezqYNu5XAAgQ-C8V9zEl5du9nuPjiReY1TDWiMwMHYAfFY8LghLFgeHBNHZlX4DRq_hfedmOr3Yl0cbO5Md8CalG42S4gT0_PIfKGX';
      // LCDAS feature URL
      this.lcdasURL = 'https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/eLAND_INFO_MapService/FeatureServer/4?token=65irQD2k6VC2KMhRu68EKOKKNwdaqcjYfooNS9uO0QIYwrTUypJBTf8SdvA6HGqG6GTvXZU-eu2BiqbBKL7TT2R7UTr927323zpJId7scgxj1hGRXCWu3B68rYGXxL2uOm1OBcHD84L0qDr2439-_92GKTJE36D2fc-pn4-4oKuSwBfu1vWwex-KnV5o6UI8B32nromQBm9Rnmdh6_sq1NGaEGC-UxAvK9FAAakB67Vrh6XR_6sxvVignzI_AXvt';

      // Acquisition Layer URL
      this.acquisionLayerURL = 'https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/eLAND_INFO_MapService/FeatureServer/3?token=65irQD2k6VC2KMhRu68EKOKKNwdaqcjYfooNS9uO0QIYwrTUypJBTf8SdvA6HGqG6GTvXZU-eu2BiqbBKL7TT2R7UTr927323zpJId7scgxj1hGRXCWu3B68rYGXxL2uOm1OBcHD84L0qDr2439-_92GKTJE36D2fc-pn4-4oKuSwBfu1vWwex-KnV5o6UI8B32nromQBm9Rnmdh6_sq1NGaEGC-UxAvK9FAAakB67Vrh6XR_6sxvVignzI_AXvt';

      // Estate Layer Url
      this.estateURL = 'https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/eLAND_INFO_MapService/FeatureServer/2?token=65irQD2k6VC2KMhRu68EKOKKNwdaqcjYfooNS9uO0QIYwrTUypJBTf8SdvA6HGqG6GTvXZU-eu2BiqbBKL7TT2R7UTr927323zpJId7scgxj1hGRXCWu3B68rYGXxL2uOm1OBcHD84L0qDr2439-_92GKTJE36D2fc-pn4-4oKuSwBfu1vWwex-KnV5o6UI8B32nromQBm9Rnmdh6_sq1NGaEGC-UxAvK9FAAakB67Vrh6XR_6sxvVignzI_AXvt';

      this.landUseUrl = 'https://services8.arcgis.com/RqA65gdwUsw4IGhD/arcgis/rest/services/eLAND_INFO_MapService/FeatureServer/1?token=65irQD2k6VC2KMhRu68EKOKKNwdaqcjYfooNS9uO0QIYwrTUypJBTf8SdvA6HGqG6GTvXZU-eu2BiqbBKL7TT2R7UTr927323zpJId7scgxj1hGRXCWu3B68rYGXxL2uOm1OBcHD84L0qDr2439-_92GKTJE36D2fc-pn4-4oKuSwBfu1vWwex-KnV5o6UI8B32nromQBm9Rnmdh6_sq1NGaEGC-UxAvK9FAAakB67Vrh6XR_6sxvVignzI_AXvt';
      /*****************************************************************
      * Point QueryTask to URL of feature service
      *****************************************************************/
      this.qTask4EstateLay = new QueryTask({
        url: this.estateURL
      });

      this.qTask4AcquisitionLay = new QueryTask({
        url: this.acquisionLayerURL
      });

      this.qTask4LandUse = new QueryTask({
        url: this.landUseUrl
      })



      /******************************************************************
       * Set the query parameters to always return geometry and all fields.
       * Returning geometry allows us to display results on the map/view
       ******************************************************************/
      this.query_params = new Query({
        returnGeometry: true,
        outFields: ['*']
      });




      /*****************************************************************
       * Layers may be added to the map in the map's constructor
       *****************************************************************/
      this.map = new Map({
        basemap: 'satellite',
        layers: [
          this.resultsEstateLyr,
          this.result4PlotQuery,
          this.ESTATE,
          this.LAND_USE, 
          this.PLOTS, 
          this.ROAD_NETWORK, 
          this.ACQUISITION,
          // this.landUsePolygonGraphics,
          this.ENCROACHMENT
        ]
      });


      /*****************************************************************
       * Or they may be added to the map using map.add()
       *****************************************************************/
      // map.add(transportationLyr);

      this.view = new MapView({
        container: 'mapId',
        map: this.map

      });


      this.view.when(() => {
        const query = this.ESTATE.createQuery();
        const queryAcq = this.ACQUISITION.createQuery();
        const queryLandUse = this.LAND_USE.createQuery();

        const estateRes = this.ESTATE.queryFeatures(query);
        const acquisitionRes = this.ACQUISITION.queryFeatures(queryAcq);
        const landUseRes = this.LAND_USE.queryFeatures(queryLandUse);

        estateRes.then(res => {
          const estateName = this.getNAME_Values(res);
          this.estateLayName = this.getUniqueValues(estateName);
          // this.generateLayerButton(this.estateLayName,this.infoDivSelect,"NAME",this.resultsEstateLyr,this.qTask4EstateLay);
        });

        acquisitionRes.then(res => {
          const acqusitionName = this.getLAYER_Values(res);
          this.acqusitionLayName = this.getUniqueValues(acqusitionName);
          console.log(this.acqusitionLayName);
        });

        landUseRes.then(res => {
          const landUseName = this.getLandUse_Values(res);
          this.landUseName = this.getUniqueValues(landUseName);
          console.log(this.landUseName);
          //load land use graphics
          this.addLandUseMap_to_View(this.landUseName);
          
        });

        // Add a basemap toggle widget to toggle between basemaps
        var toggle = new BasemapToggle({
          titleVisible: true,
          view: this.view,
          nextBasemap: this.lagosBasemap
        });

        // Add widget to the top right corner of the view
        this.view.ui.add(toggle, "top-right");

        

      }, function (error) {
        // This function will execute if the promise is rejected due to an error
        console.log(error);
      });


    }).catch(err => {
      // handle any errors
      console.error(err);
    });

  } // end of ngOnInit




  /**
 * Method to get all the Value in a particular
 * Field.
 * @param response
 */
private getNAME_Values(response) {
  const features = response.features;
  const values = features.map(function(feature) {
    return feature.attributes.NAME;
  });

  return values;
}


/**
 *  Method for getting unique value from a set of VALUE
 * @param values
 */
private getUniqueValues(values) {
  const uniqueValues = [];

  values.forEach(function(item) {
    if ((uniqueValues.length < 1 || uniqueValues.indexOf(item) ===
        -1) &&
      (item !== '')) {
        uniqueValues.push(item);
    }

  });
  return uniqueValues;
}


    /**
   * Method to get all the Value in a particular
   * Field.
   * @param response
   */
  private getLAYER_Values(response) {
    const features = response.features;
    const values = features.map(function(feature) {
      return feature.attributes.TYPE;
    });
    return values;
  }



  private getLandUse_Values(response) {
    const features = response.features;
    const values = features.map(function(feature) {
      return feature.attributes.LAND_USE;
    });
    return values;
  }


  private addLandUseMap_to_View(types){
    types.forEach(type => {
      if(type=="WATER BODY"){
        this.doFieldQuery("LAND_USE", type, this.landUsePolygonGraphics, this.qTask4LandUse,false,[99, 147, 249, 0.395],[12, 0, 1]);
      }else{
        this.doFieldQuery("LAND_USE", type, this.landUsePolygonGraphics, this.qTask4LandUse,false,this.randomColor(),[12, 0, 1]);
      }
     
    });
  }


    /**
 * Attribute Query on a Specify Field in a FeatureLayer
 * @param field
 * @param value
 * @param graphicsLayer
 */
  doFieldQuery(field, value, graphicsLayer, qTask4Specifyeature, zoom:boolean, fillcolor, outlineColor) {
    // Clear the results from a previous query
    if(zoom){
      graphicsLayer.removeAll();
    }
    /*********************************************
     *
     * Set the where clause for the query. This can be any valid SQL expression.
     * In this case the inputs from the three drop down menus are used to build
     * the query. For example, if "Elevation", "is greater than", and "10,000 ft"
     * are selected, then the following SQL where clause is built here:
     *
     * params.where = "ELEV_ft > 10000";
     *
     * ELEV_ft is the field name for Elevation and is assigned to the value of the
     * select option in the HTML below. Other operators such as AND, OR, LIKE, etc
     * may also be used here.
     *
     **********************************************/
    this.query_params.where = `${field} = \'${value}\'`;

    qTask4Specifyeature.execute(this.query_params)
    .then(res => {
      const layQuery = this.polygonLayFromFeatureLay(res, true,fillcolor,outlineColor); // [237, 187, 153, 0.8]

      graphicsLayer.addMany(layQuery);

      if(zoom){
        if (layQuery.length === 1){
          this.view.goTo(layQuery[0].geometry.extent);
        // tslint:disable-next-line:one-line
        } else{
          this.view.goTo(layQuery[0].geometry.extent);
        }
      }

    });

  }  // END of doFieldQuery


  polygonLayFromFeatureLay(feature, toTransform: boolean, fillcolor: Array<Number>, outlineColor: Array<Number>){
    const polygonGraphic = [];
    feature.features.forEach(item => {
      // console.log(item);

      let ring;
      if (toTransform) {
        ring = this._projM.transformArray2_Minna31(item.geometry.rings[0]);
      } else {
        ring = item.geometry.rings[0];
      }


      // Add the geometry and symbol to a new graphic
      polygonGraphic.push(
        new this.Graphic({
          geometry: {
            type: 'polygon',
            rings: ring,
            spatialReference: { wkid: 4326 }
          },
          symbol: {
            type: 'simple-fill', // autocasts as new SimpleFillSymbol()
            color: fillcolor, // 112, 185, 246, 0.8
            outline: { // autocasts as new SimpleLineSymbol()
              color: outlineColor,
              width: 0.5
            }
          },
          // select only the attributes you care about
          attributes: item.attributes

        })
      );
    }
   );


    return polygonGraphic;
  }


  private randomColor(){
    return [
      Math.floor(Math.random()*256),
      Math.floor(Math.random()*256),
      Math.floor(Math.random()*256),
      0.396
    ];

  }



}
