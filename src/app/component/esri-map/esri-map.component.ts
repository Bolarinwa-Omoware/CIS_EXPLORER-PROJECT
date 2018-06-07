import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
// import * as dom_to_image from 'dom-to-image';
import * as html2canvas from 'html2canvas';
import { DialogByCoordinatesComponent } from '../../component/dialog-by-coordinates/dialog-by-coordinates.component';
import { EsriMapService } from '../../services/esri-map.service';
import { FirestoreService } from '../../services/firestore.service';
import { PagesService } from '../../services/pages.service';
import { UploadService } from '../../services/upload.service';
import { CertVerifyDialogComponent } from '../cert-verify-dialog/cert-verify-dialog.component';
import { DialogDisplayResultComponent } from '../dialog-display-result/dialog-display-result.component';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { ChartingResult } from './../appModel/chartingResult';
import { GeoDataPoint } from './../appModel/geoDataPoint';
import { PdfReporter } from './../appModel/pdfReporter';


declare let $: any;
declare let proj4: any;
declare let turf: any;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit, AfterViewInit {

  method: string;
  // @Input() disabledSubmitBtn = false;
  // @Input() disabledStoreMapDataBtn = true;
  // @Input() disabledReportBtn = true;


  favoriteLayer: string;



  private landUseName: any;


  private query_params: any;
  public uploadStatus: string;


  // Variable for storing inputed geometry
  private result4PolygonSearch: any;

  // Variable for storing chating records
  private eachFeatureRecord: any;
  private eachChartingAnalysis: any;

  private landUsePolygonGraphics: any;

  private isEsriMapOpens: boolean;

  private chartingCategory: Number;

  acqusitionLayName: string[];

  private surmary: any;

  // USERS INPUT FORM MODULE VARIABLE
  private ref_number: string;
  public titleHolder: string;
  public streetName: string;
  public cityName: string;
  public town_vallage: string;
  public surveyPlanNo: string;
  public surveyBy: string;
  public dateOfSurvey: string;
  public phoneNo: string;

  public chartingResultItems: ChartingResult[];

  private currentChartingData: ChartingResult;

  // Plan Data for Certificate generation
  private planInfoCoordinates: Array<GeoDataPoint>;
  private planPoint: GeoDataPoint;
  // checking whether any feature detected
  private isFeatureDetected: boolean;

  private imgDataUrl: string;

  isProcess = true;

  public menuType = 0;


  constructor(
    private _methods: PagesService,
    public uploadService: UploadService,
    private pdfReporter: PdfReporter,
    public dialog: MatDialog,
    private fireStoreService: FirestoreService,
    private _esriMapService: EsriMapService
  ) {


   }

  ngOnInit() {
    this._methods.method.subscribe(res => this.method = res);
    this._methods.uploadStatus.subscribe(res => this.uploadStatus = res);
    // Initializing the firestore realtime database
    this.fireStoreService.getChartingResultItems().subscribe(items => {
      // console.log(items);
      this.chartingResultItems = items;
      console.log(this.chartingResultItems);

    });




    // this._esriMapModule.isEsriMapOpen.subscribe(res=> this.isEsriMapOpens = res);
    // $('.ui.floating.dropdown')
    //   .dropdown();
    // $('.ui.accordion')
    //   .accordion()
    //   ;



    //  $('#submit-btn').css({'disabled': true});

  }

  ngAfterViewInit() {
    // this.acqusitionLayName = this. _esriMapService.acqusitionLayName;
    // console.log(this.acqusitionLayName);
  }

/**
 * Template for displaying Layers in the Map
 * @param id
 */
  // tslint:disable-next-line:one-line
  private template (id){
    const tem =  `
                < mat-radio-button
                style="
                margin-top: .3em;
                z-index: 500;
                "
                value="${id}"
                >${id}</mat-radio-button>
                `;

    return tem;
  }


  // Called each time the promise is rejected
  private promiseRejected(err) {
    console.error('Promise rejected: ', err.message);
  }


/**
 * Method for processing the user data for land infomation
 * certificate generation
 * @param result data from charting dialog
 */
  private eChartingFromInputData(result) {

    // console.log(this.landUseName);

    this.titleHolder = result.attributeData[0];
    this.streetName = result.attributeData[2];
    this.town_vallage = result.attributeData[3];
    this.cityName = result.attributeData[4];
    this.surveyPlanNo = result.attributeData[1];
    this.surveyBy = result.attributeData[5];
    this.dateOfSurvey = result.attributeData[6];
    this.phoneNo = result.attributeData[7];

    const resultID = [];
    const resultData = [];

    this.planInfoCoordinates = [];
    this._esriMapService.view.graphics.removeAll();
    this.eachFeatureRecord = [];
    this.eachChartingAnalysis = [];

    const id_ref = Math.floor(Date.now() / (Math.random() * 100000) + 10000);

    this.ref_number = `OSG${ id_ref}`;

    for (let i = 0; i < result.beaconId.length; i++) {
      const pb = result.beaconId[i];
      const x = Number(result.coordinatesData[i][0]);
      const y = Number(result.coordinatesData[i][1]);
      resultID.push(pb);
      resultData.push(proj4('EPSG:26331').inverse([x, y]));

      this.planPoint = {
        id: pb,
        x: (x.toFixed(3)),
        y: (y.toFixed(3))
      };

      this.planInfoCoordinates.push(this.planPoint);
    }

    this.result4PolygonSearch = [resultID, resultData];

    const laypoint = this.createPointGraphics(this.result4PolygonSearch[1], this.result4PolygonSearch[0]);
    const polygon2search = this.create_polygon(laypoint);

    this._esriMapService.view.graphics.add(polygon2search);

    this._esriMapService.view.zoom = 14;

    this._esriMapService.view.goTo(polygon2search.geometry.extent); // centroid

    const polygonGeometry = {
      type: 'polygon',
      rings: resultData,
      spatialReference: { wkid: 4326 }
    };

    this._esriMapService.query_params4plot = new this._esriMapService.Query({
      geometry: polygonGeometry,
      spatialRelationship: 'intersects',
      returnGeometry: true,
      outFields: ['*']
    });

    if (this.chartingCategory === 0) {
      this._esriMapService.qTask4PlotLay = new this._esriMapService.QueryTask({
        url: this._esriMapService.plotURL
      });

      // tslint:disable-next-line:no-shadowed-variable
      this._esriMapService.qTask4PlotLay.execute(this._esriMapService.query_params4plot).then(result => {

        const layQuery =  this._esriMapService.polygonLayFromFeatureLay(result, false, [255, 0, 29], [ 244, 221, 7]);
        this._esriMapService.resultsEstateLyr.removeAll();
        this._esriMapService.resultsEstateLyr.addMany(layQuery);
        // this.view.goTo(layQuery[0].geometry.extent);

        const targetPolygon = turf.polygon(this.buildPolygon(resultData)); // target polygon to search for


        this.eachFeatureRecord = []; // Storing record from search parcel query features
        this.eachChartingAnalysis = [];

        let count = 1;
        layQuery.forEach((res) => {

          const getfea = this.extractInterceptArea(targetPolygon, res);
          const originalfeatures = turf.polygon(res.geometry.rings);



          // tslint:disable-next-line:one-line
          if (getfea !== 'undefined'){
            const interceptsfeature = getfea;
            const areaAnalysis = this.overlapAnalysis(targetPolygon, interceptsfeature, originalfeatures);
            this.eachChartingAnalysis.push(areaAnalysis);
            this.eachFeatureRecord.push(this.getParcelRecord_from_Database(res, count, areaAnalysis));
            count++;
          }
        });

      }

    ); // End of query task for land record polygon search

    // Query procedure for acqusition charting.
    // tslint:disable-next-line:one-line
    } else{  // LOGIC FOR LAND CHARTING INFORMATION GENERATION
      this._esriMapService.qTask4PlotLay = new  this._esriMapService.QueryTask({
        url:  this._esriMapService.acquisionLayerURL
      });

      // tslint:disable-next-line:no-shadowed-variable
      this._esriMapService.qTask4PlotLay.execute( this._esriMapService.query_params4plot).then(result => {

        // tslint:disable-next-line:one-line
        if (result.features.length === 0){

          this.isFeatureDetected  = false;
          const targetPolygon = turf.polygon(this.buildPolygon(resultData)); // target polygon to search for
          const areaAnalysis = this.overlapAnalysis(targetPolygon, 'interceptsfeature', 'originalfeatures');

          this.eachChartingAnalysis.push(areaAnalysis);
          this.eachFeatureRecord.push(this.getAcqusitionRecord_from_Database('res', 'count', areaAnalysis));

          this.surmary = this.surmaryReport(this.eachChartingAnalysis);


        }
        // tslint:disable-next-line:one-line
        else {
          this.isFeatureDetected  = true;
          const layQuery =  this._esriMapService.polygonLayFromFeatureLay(result, false, [255, 0, 29], [244, 221, 7]);
          this._esriMapService.resultsEstateLyr.removeAll();
          this._esriMapService.resultsEstateLyr.addMany(layQuery);


          const targetPolygon = turf.polygon(this.buildPolygon(resultData)); // target polygon to search for


          this.eachFeatureRecord = []; // Storing record from search parcel query features
          this.eachChartingAnalysis = [];

          let count = 1;
          layQuery.forEach((res) => {

            const getfea = this.extractInterceptArea(targetPolygon, res);
            const originalfeatures = turf.polygon(res.geometry.rings);

            // tslint:disable-next-line:one-line
            if (getfea !== 'undefined'){
              const interceptsfeature = getfea;
              const areaAnalysis = this.overlapAnalysis(targetPolygon, interceptsfeature, originalfeatures);

              console.log(areaAnalysis);


              this.eachChartingAnalysis.push(areaAnalysis);
              this.eachFeatureRecord.push(this.getAcqusitionRecord_from_Database(res, count, areaAnalysis));
              count++;
            }
          });

          this.surmary = this.surmaryReport(this.eachChartingAnalysis);
        } // end else

      } // END OF LAND INFORMATION CHARTING MODULE

    ); // End of query task for land record polygon search
    }


  } // END of eChartingFromInputData

  // tslint:disable-next-line:one-line
  private buildPolygon(item){
    const result = [[]];
    // tslint:disable-next-line:one-line
    for (let i = 0; i < item.length; i++){
      result[0].push(item[i]);
    }
    result[0].push(item[0]);
    return result;
  }

  // tslint:disable-next-line:one-line
  private extractInterceptArea(target, poly2){

    const feature2 = turf.polygon(poly2.geometry.rings);
    const intersection = turf.intersect(target, feature2);

    return intersection;
  }

    // tslint:disable-next-line:one-line
    private getLandHoldingLayer(serachField, value){
      // tslint:disable-next-line:max-line-length
      this._esriMapService.doFieldQuery(serachField, value,  this._esriMapService.resultsEstateLyr,  this._esriMapService.qTask4AcquisitionLay, true, [249, 2, 14], [ 244, 221, 7]);
      // console.log(this.randomColor());

    }



/**
 * Method for get all record related to the target feature
 * @param targetFeature : target feature form previous query
 * @param count
 * @param areaAnalysis
 */
  // tslint:disable-next-line:one-line
  private getParcelRecord_from_Database(targetFeature, count, areaAnalysis){

    const recordsResult = [];

    // Pointing QueryTask to Road Network URL feature service
    const qTask = new  this._esriMapService.QueryTask({
      url:  this._esriMapService.roadNetworkURL
    });

    const params1 = new  this._esriMapService.Query({
      returnGeometry: true,
      outFields: ['*']
    });

    const streetId: string = targetFeature.attributes.StreetID;
    params1.where =  'StreetID = \'' + streetId + '\'';

    // executes the query and calls getResults() once the promise is resolved
    // promiseRejected() is called if the promise is rejected
    qTask.execute(params1)
      .then(response1 => { // response1 is from the road network
        const recordValues = [];
        // Pointing QueryTask to Road Network URL feature service
        const qTask2 = new  this._esriMapService.QueryTask({
          url: this._esriMapService.lcdasURL
        });

        const params2 = new  this._esriMapService.Query({
          returnGeometry: true,
          outFields: ['*']
        });

        params2.geometry = response1.features[0].geometry;
        qTask2.execute(params2)
        .then(response2 => {


          // Gathering all records form all link database
          recordValues.push('DETECTED PARCEL ' + count);
          recordValues.push(targetFeature.attributes.ESTATE);
          recordValues.push(targetFeature.attributes.BLOCK_ID);
          recordValues.push(targetFeature.attributes.PLOT_NO);
          recordValues.push(targetFeature.attributes.PLAN_NO);
          recordValues.push(areaAnalysis[2]); // "FEATURE SIZE (Sq.m)"
          recordValues.push(areaAnalysis[0]); // "SEARCH-FEATURE SIZE (Sq.m)"
          recordValues.push(areaAnalysis[1]); //  "OVERLAPPING SIZE (Sq.m)"
          recordValues.push(areaAnalysis[3]); // "PERCENTAGE OVERLAP"
          recordValues.push(response1.features[0].attributes.StreetID); // "STREET ID"
          recordValues.push(response1.features[0].attributes.Street); // "STREET NAME"
          recordValues.push(response2.features[0].attributes.LCDA); // "LCDA"
          recordValues.push(response2.features[0].attributes.LGA); // "LGA"
          recordValues.push(response1.features[0].attributes.City); // "CITY "
          recordValues.push(response1.features[0].attributes.Region); //  "REGION"
          recordValues.push(response1.features[0].attributes.Country); //  "country"
          recordValues.push('STATUS'); //  "country"


          // tslint:disable-next-line:one-line
          for (let i = 0; i < 16; i++){
            recordsResult.push(
               recordValues[i]
            );

          }

        });


      });
      // .otherwise(this.promiseRejected);



      return recordsResult;
  }

  // tslint:disable-next-line:one-line
  private surmaryReport(records){
    const number_of_overlap: Number = records.length;
    let totalOverlappingSize: Number = 0;
    let totalPercentageOverlap: Number = 0;
    let totalFreeSize: Number;

    records.forEach(record => {
      totalOverlappingSize = totalOverlappingSize + record[1];
      totalPercentageOverlap = totalPercentageOverlap + record[3];
    });

    totalFreeSize = Number(records[0][0] ) - Number(totalOverlappingSize);

    // tslint:disable-next-line:one-line
    if (totalFreeSize <= 2.5){
      totalFreeSize = 0.000;
    }else {
      totalFreeSize = totalFreeSize;
    }
    return [
      number_of_overlap,
      Number(records[0][0]).toFixed(3),
      totalOverlappingSize.toFixed(3),
      totalPercentageOverlap.toFixed(1),
      totalFreeSize.toFixed(3)
    ];
  }


/**
 * Method for get all record related to the target feature
 * from Acqusition Layer
 * @param targetFeature : target feature form previous query
 * @param count
 * @param areaAnalysis
 */
private getAcqusitionRecord_from_Database(targetFeature, count, areaAnalysis) {

  const recordsResult = [];

  // tslint:disable-next-line:one-line
  if (this.isFeatureDetected){
    recordsResult.push({'field': 'DETECTED FEATURE S/N ', 'value': count });
    recordsResult.push({'field': 'DESCRIPTION', 'value': targetFeature.attributes.DESCRIPTION });
    recordsResult.push({'field': 'REFENCE NAME', 'value': targetFeature.attributes.REF_NAME});
    recordsResult.push({'field': 'COMMITMENT STATUS', 'value': targetFeature.attributes.COMMITMENT });
    recordsResult.push({'field': 'GAZETTE NO.', 'value': targetFeature.attributes.GAZETTE_NO });
    recordsResult.push({'field': 'PUBLISH DATE', 'value': targetFeature.attributes.DATE_PUB});
    recordsResult.push({'field': 'INPUT FEATURE SIZE (Sq.m)', 'value': areaAnalysis[0].toFixed(3) });
    recordsResult.push({'field': 'OVERLAPPING SIZE (Sq.m)', 'value': areaAnalysis[1].toFixed(3)  });
    recordsResult.push({'field': 'SIZE FREE (Sq.m)', 'value': areaAnalysis[2].toFixed(3)  });
    recordsResult.push({'field': 'PERCENTAGE OVERLAP', 'value': `${areaAnalysis[3].toFixed(2)}%`  });
  } else {
    recordsResult.push({'field': 'DETECTED FEATURE S/N ', 'value': 'NO FEATURE DETECTED' });
    recordsResult.push({'field': 'DESCRIPTION', 'value': 'FREEHOLD' });
    recordsResult.push({'field': 'REFENCE NAME', 'value': 'NONE'});
    recordsResult.push({'field': 'COMMITMENT STATUS', 'value': 'NO ANY COMMITMENT' });
    recordsResult.push({'field': 'GAZETTE NO.', 'value': 'NONE'});
    recordsResult.push({'field': 'PUBLISH DATE', 'value': 'NONE'});
    recordsResult.push({'field': 'INPUT FEATURE SIZE (Sq.m)', 'value': areaAnalysis[0].toFixed(3) });
    recordsResult.push({'field': 'OVERLAPPING SIZE (Sq.m)', 'value': areaAnalysis[1].toFixed(3)  });
    recordsResult.push({'field': 'SIZE FREE (Sq.m)', 'value': areaAnalysis[2].toFixed(3)  });
    recordsResult.push({'field': 'PERCENTAGE OVERLAP', 'value': `${areaAnalysis[3].toFixed(2)}%`  });
  }

  return recordsResult;
}


  /**
   * Module for Area analysis, percentage overlap
   *  and other overlaping analysis
   * @param target
   * @param intersections
   * @param originalfeatures
   */
  // tslint:disable-next-line:one-line
  private overlapAnalysis(target, intersections, originalfeatures){

    let area4Intersect ;
    let area4originalFeatures;
    let targetArea ;
    let area4Free;
    let percentOverlap ;

    // tslint:disable-next-line:one-line
    if (this.isFeatureDetected){
      area4Intersect = turf.area(intersections);
      area4originalFeatures = turf.area(originalfeatures);
      targetArea = turf.area(target);
      area4Free = targetArea - area4Intersect;
      percentOverlap = (area4Intersect / targetArea ) * 100;

    }else {
      area4Intersect = 0.000;
      area4Free = 0.000;
      targetArea = turf.area(target);
      percentOverlap = 0;
    }

    return [
      targetArea,
      area4Intersect,
      area4Free,
      percentOverlap
    ];
  }


  // tslint:disable-next-line:one-line
  private projLayer2WebMer(feature){
    const projFeatures = [];
    feature.features.forEach(item => {
      if ( this._esriMapService.webMer.canProject(item.geometry,  this._esriMapService.SpatialReference .WebMercator)) {

        projFeatures.push( this._esriMapService.webMer.project(item.geometry,  this._esriMapService.SpatialReference.WebMercator));
        // console.log(projLayer);
      }

    });
    return this.createLayer(feature, projFeatures);
  }

/*************************************************
*     METHOD FOR CREATING GRAPHICS FEATURES
**************************************************/
private createPointGraphics(data, attributes) {

  const pointGraphic = [];
  data.map((item, i) => {
    // const latLong = proj4(proj[0]).inverse(item);
    const pointFeature = new  this._esriMapService.Graphic({
      geometry: {
        type: 'point', // autocasts as new Point()
        longitude: item[0],
        latitude: item[1]
      },
      symbol: {
        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
        color: [226, 119, 40],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      },
      attributes: {
        ObjectID: i,
        Name: attributes[i],
        Easting: item[0],
        Northing: item[1]
      },
      popupTemplate: {
        title: '{Name}',
        content: [{
          type: 'fields',
          fieldInfos: [{
            fieldName: 'Name'
          }, {
            fieldName: 'Easting'
          }, {
            fieldName: 'Northing'
          }]
        }]
      }
    });
    this._esriMapService.view.graphics.add(pointFeature);
    pointGraphic.push(pointFeature);
  });

  return pointGraphic;
}

private create_polygon(pointsData) {

  const ring = [];
  pointsData.forEach(pt => {
    const point = pt.geometry;
    ring.push([point.x, point.y]);

  });
  ring.push(ring[0]);

  // Add the geometry and symbol to a new graphic
  const polygonGraphic = new  this._esriMapService.Graphic({
    geometry: {
      type: 'polygon',
      rings: ring,
      spatialReference: { wkid: 4326 }
    },
    // style: "backward-diagonal",
    symbol : {
      type: 'simple-line',  // autocasts as new SimpleLineSymbol()
      color: 'yellow',
      width: '4px',
      style: 'solid'
    },
    // select only the attributes you care about
    attributes: {
      ObjectID: 0,
      Name: 'Target Polygon'
    }
  });

  return polygonGraphic;
}


/**************************************************
* Create a FeatureLayer with the array of graphics
**************************************************/

private createLayer(graphics, projSource) {

  const lyr = new  this._esriMapService.FeatureLayer({
    source: projSource, // autocast as an array of esri/Graphic
    // create an instance of esri/layers/support/Field for each field object
    fields: graphics.fields, // This is required when creating a layer from Graphics
    objectIdField: 'ObjectID', // This must be defined when creating a layer from Graphics
    spatialReference: {
      wkid: 102100
    },
    geometryType: graphics.geometryType // Must be set when creating a layer from Graphics
    // popupTemplate: pTemplate
  });

  // this.map.add(lyr);
  return lyr;
}


private captureImage(): void {

  html2canvas($('.esri-view-root')[0],
    {
      windowWidth: 1200,
      windowHeight: 900,
      backgroundColor: '#37373D',
      foreignObjectRendering: false,
      useCORS: false,
      logging: true

    }
    ).then(function(canvas) {
      const imgsrc = canvas.toDataURL('image/jpeg');
      $('#mapImg').attr('src', imgsrc);

    });

    const dialogRef = this.dialog.open(  StatusDialogComponent, {
      width: '40%',
      height: '450',
      disableClose: true,
      autoFocus: true,
      data: {
       statusProgress: ' DATA PROCESS SUCCESSFULLY !!!'
      }
    });

}


public submit2server(): void {



  this.currentChartingData = {
    ref_no: this.ref_number,
    titleHolder: this.titleHolder,
    streetName: this.streetName,
    cityName: this.cityName,
    town_village:  this.town_vallage,
    surveyPlanNo: this.surveyPlanNo,
    surveyBy: this.surveyBy,
    date_of_survey: this.dateOfSurvey,
    phoneNumber: this.phoneNo,
    planInfoCoodinates: this.planInfoCoordinates,
    total_no_overlap: this.surmary[0],
    feature_size: this.surmary[1],
    total_overlaping_size: this.surmary[2],
    total_percentage_overlap: this.surmary[3],
    total_size_free: this.surmary[4],
    acquisition_status: `
      ${this.surmary[3]}% OF THE SIZE OF THE PIECE OF LAND
      DEPICTED BY THE INPUTED SPATIAL DATA ABOVE,
      FALL WITHIN KNOWN GOVERNMENT
      ACQUISITION OR REVOCATION.

      WHILE  ${100 - this.surmary[3]}% OF IT SIZE IS FREE FROM KNOWN
      GOVERNMENT ACQUISITION OR REVOCATION.
`,
    report_dataUrl: this.pdfReporter.outputResult,

    dateCreated: this.pdfReporter.getCurrentDate()

  };
  this.fireStoreService.addChartingResultItems(this.ref_number, this.currentChartingData);

  const dialogRef = this.dialog.open(StatusDialogComponent, {
    width: '40%',
    height: '450',
    disableClose: true,
    autoFocus: true,
    data: {
     statusProgress: ' DATA SAVE ON THE SERVER SUCCESSFULLY !!!'
    }
  });


}


public openByCoordinatesDialog(): void {
  this._methods.setMethod('QUERY BY COORDINATES METHOD');
  if(this.method === 'QUERY BY COORDINATES METHOD'){
    $("#byCoord").css({"display": "block"});
  }
  const dialogRef = this.dialog.open(  DialogByCoordinatesComponent, {
    width: '58%',
    height: '80vh',
    disableClose: true,
    autoFocus: true,
    data: {
      beaconId: [],
      coordinatesData: [],
      attributeData: []
    }
  });


  dialogRef.afterClosed().subscribe(result => {
    this.eChartingFromInputData(result);
  });


} // END OF openByCoordinatesDialog().

openByDxfDialog(): void {

  this._methods.setMethod('QUERY USING IMPORTED AUTOCAD DXF-FILE');
  this._methods.setUploadStatus('loading');
  if(this.method !== 'QUERY BY COORDINATES METHOD'){
    $("#byCoord").css({"display": "none"});
  }
  const dialogRef = this.dialog.open(  DialogByCoordinatesComponent, {
    width: '58%',
    height: '80vh',
    disableClose: true,
    autoFocus: true,
    data: {
      beaconId: [],
      coordinatesData: [],
      attributeData: []
    }
  });


  dialogRef.afterClosed().subscribe(result => {
    this.eChartingFromInputData(result);
    console.log(result);
    
  });
} // END OF openByDxfDialog

openByShapefile(): void{
  this._methods.setMethod('QUERY USING IMPORTED SHAPEFILE');
  this._methods.setUploadStatus('loading');
  if(this.method !== 'QUERY BY COORDINATES METHOD'){
    $("#byCoord").css({"display": "none"});
  }
  const dialogRef = this.dialog.open(  DialogByCoordinatesComponent, {
    width: '45vw',
    height: '60vh',
    disableClose: true,
    autoFocus: true,
    data: {
      beaconId: [],
      coordinatesData: [],
      attributeData: []
    }
  });


  dialogRef.afterClosed().subscribe(result => {
    this.eChartingFromInputData(result);
    console.log(result);
    
  });
} // END OF openByShapefile

openByCSVfile(): void{
  this._methods.setMethod('QUERY USING IMPORTED CSVFILE');
  this._methods.setUploadStatus('loading');
  if(this.method !== 'QUERY BY COORDINATES METHOD'){
    $("#byCoord").css({"display": "none"});
  }
  const dialogRef = this.dialog.open(  DialogByCoordinatesComponent, {
    width: '58%',
    height: '80vh',
    disableClose: true,
    autoFocus: true,
    data: {
      beaconId: [],
      coordinatesData: [],
      attributeData: []
    }
  });


  dialogRef.afterClosed().subscribe(result => {
    this.eChartingFromInputData(result);
    console.log(result);
    
  });
} // END OF openByShapefile



openByBearingDistance(): void{
  this._methods.setMethod('QUERY USING BEARING AND DISTANCES');
  this._methods.setUploadStatus('traversing');
  if(this.method !== 'QUERY BY COORDINATES METHOD'){
    $("#byCoord").css({"display": "none"});
  }
  const dialogRef = this.dialog.open(  DialogByCoordinatesComponent, {
    width: '58%',
    height: '80vh',
    disableClose: true,
    autoFocus: true,
    data: {
      beaconId: [],
      coordinatesData: [],
      attributeData: []
    }
  });


  dialogRef.afterClosed().subscribe(result => {
    this.eChartingFromInputData(result);
    console.log(result);
    
  });
} // END OF openByShapefile

// tslint:disable-next-line:one-line
public openChartingResult(): void{
  
  this.pdfReporter.createPdf(
      this.ref_number,
      this.titleHolder,
      this.streetName,
      this.town_vallage,
      this.cityName,
      this.surveyPlanNo,
      this.planInfoCoordinates,
      this.eachFeatureRecord,
      this.surmary,
      $('#mapImg').attr('src')
  );

  const dialogRef = this.dialog.open(  DialogDisplayResultComponent, {
    width: '85%',
    height: '800',
    disableClose: true,
    autoFocus: true,
    data: {
      pdfOutput: this.pdfReporter.outputResult
    }
  });



} // END OF openChartingResult()


processReport(): void {
  this.captureImage();
}

public openLandInfoCertVerificationForm(): void {
  const dialogRef = this.dialog.open(CertVerifyDialogComponent, {
    width: '55%',
    height: '450',
    disableClose: true,
    autoFocus: true,
    data: {
      ref_id: ''
    }
  });


  dialogRef.afterClosed().subscribe(result => {

    if (result === 'close') {
      // tslint:disable-next-line:no-shadowed-variable
      const dialogRef = this.dialog.open(StatusDialogComponent, {
        width: '40%',
        height: '450',
        disableClose: true,
        autoFocus: true,
        data: {
         statusProgress: ' NO ACTION DEPLOYED !!!'
        }
      });
    } else if (result.ref_id !== '') {
      this.fireStoreService.getChartingResultBy_RefId(result.ref_id).subscribe(item => {
        // console.log(item[0].data);
        try {
          // tslint:disable-next-line:no-shadowed-variable
          const dialogRef = this.dialog.open(  DialogDisplayResultComponent, {
            width: '85%',
            height: '800',
            disableClose: true,
            autoFocus: true,
            data: {
              pdfOutput: item[0].data.report_dataUrl
            }
          });
        } catch (error) {
          // tslint:disable-next-line:no-shadowed-variable
          const dialogRef = this.dialog.open(StatusDialogComponent, {
            width: '40%',
            height: '450',
            disableClose: true,
            autoFocus: true,
            data: {
             statusProgress: ' CERTIFICATE NOT FIND ON OUR SERVER !!!'
            }
          });
        }

      });
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      const dialogRef = this.dialog.open(StatusDialogComponent, {
        width: '40%',
        height: '450',
        disableClose: true,
        autoFocus: true,
        data: {
         statusProgress: ' EMPTY FIELD PLEASE ENTER A REF_NO !!!'
        }
      });
    }


  });
} // END OF openByCoordinatesDialog().

}
