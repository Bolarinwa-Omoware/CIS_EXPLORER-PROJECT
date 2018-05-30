import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { Map } from 'mapbox-gl';
import { FeatureCollection, GeoJson } from '../../geoModels/geo-model';
import { AuthService } from '../../services/auth.service';
import { MapboxGlService } from '../../services/mapbox-gl.service';
import { MongodbService } from '../../services/mongodb.service';
import { FeatureLayersDialogComponent } from '../feature-layers-dialog/feature-layers-dialog.component';
import { FeatureUploadComponent } from '../feature-upload/feature-upload.component';


declare let $: any;


@Component({
  selector: 'app-mapbox-page',
  templateUrl: './mapbox-page.component.html',
  styleUrls: ['./mapbox-page.component.css']
})
export class MapboxPageComponent implements OnInit, AfterViewInit { //, AfterViewInit


    /// default settings
    // map: Map;

     // data
     mapDataSource = [];
     hoverFilter = ['==', 'name', ''];

    // Users role variable
    role: string;

  constructor(
    _mapboxService: MapboxGlService,
    private authService: AuthService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private mongodbServer: MongodbService
  ) { }

  ngOnInit() {

    this.authService.userRole.subscribe(res => this.role = res);
    this.mongodbServer.geoFeatureData.subscribe((res)=> this.mapDataSource = res);

  }

  ngAfterViewInit(): void {
    // this.initializeMap(); 
    // console.log(this.map);
  }

  onLoad(mapInstance: Map){
    const map = mapInstance;

    map.addLayer({
        "id": "bis-excess",
        "type": "fill",
        "source": this.mapDataSource[0],
        "paint": {
          "fill-color": "#FA0D0D",
            "fill-opacity": 0.5
        },
        "filter": ["==", "$type", "Polygon"]
    });

    
  }

  // private initializeMap() {

    
  //   // let bisDat = this.bisData
    
  //   /// locate the user
  //   var map = new mapboxgl.Map({
  //   container: "map",
  //   style: "mapbox://styles/mapbox/outdoors-v9",
  //   center: [3.458787,6.460754],
  //   zoom: 14
  //   });

    
  //   map.on("load", function() {

  //     map.addSource("bis-excess", {
  //       "type": "geojson",
  //       "data": dataBis[0]
  //     });

  //     map.addSource("bis-plots", {
  //       "type": "geojson",
  //       "data": dataBis[1]
  //     });



  //     map.addLayer({
  //       "id": "bis-excess",
  //       "type": "fill",
  //       "source": "bis-excess",
  //       "paint": {
  //         "fill-color": "#FA0D0D",
  //           "fill-opacity": 0.5
  //       },
  //       "filter": ["==", "$type", "Polygon"]
  //     });

  //     map.addLayer({
  //       "id": "bis-plots",
  //       "type": "fill",
  //       "source": "bis-plots",
  //       "paint": {
  //         "fill-color": "#8888ff",
  //         "fill-opacity": 0.4
  //       },
  //       "filter": ["==", "$type", "Polygon"]
  //     });

  //     // map.addLayer({
  //     //   "id": "lekki-plots",
  //     //   "type": "fill",
  //     //   "source": "lekki-plots",
  //     //   "paint": {
  //     //     "fill-color": "#8788ff",
  //     //     "fill-opacity": 0.5
  //     //   },
  //     //   "filter": ["==", "$type", "Polygon"]
  //     // });


  //       $("#addFeature").click(function(){
          
  //         map.addSource("lekki-plots", {
  //           "type": "geojson",
  //           "data": dataBis[2]
  //         });
  //         map.addLayer({
  //           "id": "lekki-plots",
  //           "type": "fill",
  //           "source": "lekki-plots",
  //           "paint": {
  //             "fill-color": "#8788ff",
  //             "fill-opacity": 0.5
  //           },
  //           "filter": ["==", "$type", "Polygon"]
  //         });
  //       });
  //   });
  // }


  uploadNewFeature(){
    const dialogRef = this.dialog.open(FeatureUploadComponent, {
      width: '40%',
      height: '55vh',
      disableClose: true,
      autoFocus: true,

    });
  }

  openFeatureLayer(){
    this.bottomSheet.open(FeatureLayersDialogComponent);
  }


  activateHoverOn(evt: any) {
    this.hoverFilter = ['==', 'name', evt];
    console.log(this.hoverFilter);
  }

  disableHover() {
    this.hoverFilter = ['==', 'name', ''];
  }


  format2Geojson(data: any):FeatureCollection{
    
    let features:Array<GeoJson> = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let fea = new GeoJson(element.geometry.coordinates, element.properties);
      features.push(fea);
    }

    return new FeatureCollection(features);
  }

}


























  // getJsonData(featureId){
  //     let data;
  //     let err:boolean = true;
  //     return new Promise((resolve, reject)=>{
  //         setTimeout(()=>{
  //           this.mongodbServer.getGeoFeatureCollectionById(featureId).subscribe(res=>{
  //               data = res;
  //               err = false;

  //               if(err) {
  //                   reject();
  //               } else{
  //                   resolve(data);
  //               }
  //           });
  //         },1000);

  //     })
  // }
