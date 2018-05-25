import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import * as mapboxgl from 'mapbox-gl';
import { FeatureCollection, GeoJson } from '../../geoModels/geo-model';
import { AuthService } from '../../services/auth.service';
import { MapboxGlService } from '../../services/mapbox-gl.service';
import { MongodbService } from '../../services/mongodb.service';
import { FeatureLayersDialogComponent } from '../feature-layers-dialog/feature-layers-dialog.component';
import { FeatureUploadComponent } from '../feature-upload/feature-upload.component';

@Component({
  selector: 'app-mapbox-page',
  templateUrl: './mapbox-page.component.html',
  styleUrls: ['./mapbox-page.component.css']
})
export class MapboxPageComponent implements OnInit, AfterViewInit { //, AfterViewInit


    /// default settings
    // map: mapboxgl.Map;
    style = "mapbox://styles/mapbox/outdoors-v9";//'mapbox://styles/ware185/cjgvzvkmg003v2rljc03ogjbi';
    lat = 6.625029549925361;
    lng = 3.453025132069575; 

     // data
      bisData: any;
      markers: any;
    
        

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
  }

  ngAfterViewInit(): void {

    this.getJsonData('5b069f0c6573ca2424b0fee3').then((val)=>{
        this.bisData = val["features"];
        this.initializeMap(); 
              
    },err=>{console.log(err);}
    );


    
  }

  private initializeMap() {

    
    let bisDat = this.format2Geojson(this.bisData);
    
    /// locate the user
    var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/outdoors-v9",
    center: [3.458787,6.460754],
    zoom: 14
    });

    
    map.on("load", function() {
        map.addSource("bis-excess", {
            "type": "geojson",
            "data": bisDat
        });
    
        map.addLayer({
            "id": "bis-excess",
            "type": "fill",
            "source": "bis-excess",
            "paint": {
                "fill-color": "#888888",
                "fill-opacity": 0.4
            },
            "filter": ["==", "$type", "Polygon"]
        });
    });
  }


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


  getJsonData(featureId){
      let data;
      let err:boolean = true;
      return new Promise((resolve, reject)=>{
          setTimeout(()=>{
            this.mongodbServer.getGeoFeatureCollectionById(featureId).subscribe(res=>{
                data = res;
                err = false;

                if(err) {
                    reject();
                } else{
                    resolve(data);
                }
            });
          },1000);

      })
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
