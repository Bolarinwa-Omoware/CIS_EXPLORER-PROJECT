import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import * as mapboxgl from 'mapbox-gl';
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
      source: any;
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
    this.initializeMap();
  }

  private initializeMap() {
    /// locate the user
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v9",
      center: [-121.403732, 40.492392],
      zoom: 10
    });


    map.on("load", function() {
      map.addSource("national-park", {
          "type": "geojson",
          "data": {
              "type": "FeatureCollection",
              "features": [{
                  "type": "Feature",
                  "geometry": {
                      "type": "Polygon",
            "properties":{
              "namsmm": "mmppd"
            },
                      "coordinates": [
                          [
                              [-121.353637, 40.584978],
                              [-121.284551, 40.584758],
                              [-121.275349, 40.541646],
                              [-121.246768, 40.541017],
                              [-121.251343, 40.423383],
                              [-121.326870, 40.423768],
                              [-121.360619, 40.434790],
                              [-121.363694, 40.409124],
                              [-121.439713, 40.409197],
                              [-121.439711, 40.423791],
                              [-121.572133, 40.423548],
                              [-121.577415, 40.550766],
                              [-121.539486, 40.558107],
                              [-121.520284, 40.572459],
                              [-121.487219, 40.550822],
                              [-121.446951, 40.563190],
                              [-121.370644, 40.563267],
                              [-121.353637, 40.584978]
                          ]
                      ]
                  }
              }, {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [-121.415061, 40.506229]
                  }
              }, {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [-121.505184, 40.488084]
                  }
              }, {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [-121.354465, 40.488737]
                  }
              }]
          }
      });
  
      map.addLayer({
          "id": "park-boundary",
          "type": "fill",
          "source": "national-park",
          "paint": {
              "fill-color": "#888888",
              "fill-opacity": 0.4
          },
          "filter": ["==", "$type", "Polygon"]
      });
  
      map.addLayer({
          "id": "park-volcanoes",
          "type": "circle",
          "source": "national-park",
          "paint": {
              "circle-radius": 6,
              "circle-color": "#B42222"
          },
          "filter": ["==", "$type", "Point"],
      });
  });

    
    // setTimeout(()=>{this.buildMap()}, 500);

  }


  // buildMap() {

  //   this.map.on("load", function() {
  //     this.map.addSource("national-park", {
  //         "type": "geojson",
  //         "data": {
  //             "type": "FeatureCollection",
  //             "features": [{
  //                 "type": "Feature",
  //                 "geometry": {
  //                     "type": "Polygon",
  //           "properties":{
  //             "namsmm": "mmppd"
  //           },
  //                     "coordinates": [
  //                         [
  //                             [-121.353637, 40.584978],
  //                             [-121.284551, 40.584758],
  //                             [-121.275349, 40.541646],
  //                             [-121.246768, 40.541017],
  //                             [-121.251343, 40.423383],
  //                             [-121.326870, 40.423768],
  //                             [-121.360619, 40.434790],
  //                             [-121.363694, 40.409124],
  //                             [-121.439713, 40.409197],
  //                             [-121.439711, 40.423791],
  //                             [-121.572133, 40.423548],
  //                             [-121.577415, 40.550766],
  //                             [-121.539486, 40.558107],
  //                             [-121.520284, 40.572459],
  //                             [-121.487219, 40.550822],
  //                             [-121.446951, 40.563190],
  //                             [-121.370644, 40.563267],
  //                             [-121.353637, 40.584978]
  //                         ]
  //                     ]
  //                 }
  //             }, {
  //                 "type": "Feature",
  //                 "geometry": {
  //                     "type": "Point",
  //                     "coordinates": [-121.415061, 40.506229]
  //                 }
  //             }, {
  //                 "type": "Feature",
  //                 "geometry": {
  //                     "type": "Point",
  //                     "coordinates": [-121.505184, 40.488084]
  //                 }
  //             }, {
  //                 "type": "Feature",
  //                 "geometry": {
  //                     "type": "Point",
  //                     "coordinates": [-121.354465, 40.488737]
  //                 }
  //             }]
  //         }
  //     });
  
  //     this.map.addLayer({
  //         "id": "park-boundary",
  //         "type": "fill",
  //         "source": "national-park",
  //         "paint": {
  //             "fill-color": "#888888",
  //             "fill-opacity": 0.4
  //         },
  //         "filter": ["==", "$type", "Polygon"]
  //     });
  
  //     this.map.addLayer({
  //         "id": "park-volcanoes",
  //         "type": "circle",
  //         "source": "national-park",
  //         "paint": {
  //             "circle-radius": 6,
  //             "circle-color": "#B42222"
  //         },
  //         "filter": ["==", "$type", "Point"],
  //     });
  // });
  



  //   this.map.on("load", (e)=>{
  //     this.mongodbServer.getGeoFeatureCollectionById('5b069f0c6573ca2424b0fee3').subscribe(res=>{
  //       console.log(res);
        
  //       this.map.on("load", ()=>{
  //         this.map.addSource('excess',{
  //           "type": "geojson",
  //           "data":{
  //             "type": "FeatureCollection",
  //             "features": [{
  //                 "type": "Feature",
  //                 "geometry": {
  //                     "type": "Polygon",
  //           "properties":{
  //             "namsmm": "mmppd"
  //           },
  //                     "coordinates": [
  //                         [
  //                             [-121.353637, 40.584978],
  //                             [-121.284551, 40.584758],
  //                             [-121.275349, 40.541646],
  //                             [-121.246768, 40.541017],
  //                             [-121.251343, 40.423383],
  //                             [-121.326870, 40.423768],
  //                             [-121.360619, 40.434790],
  //                             [-121.363694, 40.409124],
  //                             [-121.439713, 40.409197],
  //                             [-121.439711, 40.423791],
  //                             [-121.572133, 40.423548],
  //                             [-121.577415, 40.550766],
  //                             [-121.539486, 40.558107],
  //                             [-121.520284, 40.572459],
  //                             [-121.487219, 40.550822],
  //                             [-121.446951, 40.563190],
  //                             [-121.370644, 40.563267],
  //                             [-121.353637, 40.584978]
  //                         ]
  //                     ]
  //                 }
  //             }, {
  //                 "type": "Feature",
  //                 "geometry": {
  //                     "type": "Point",
  //                     "coordinates": [-121.415061, 40.506229]
  //                 }
  //             }, {
  //                 "type": "Feature",
  //                 "geometry": {
  //                     "type": "Point",
  //                     "coordinates": [-121.505184, 40.488084]
  //                 }
  //             }, {
  //                 "type": "Feature",
  //                 "geometry": {
  //                     "type": "Point",
  //                     "coordinates": [-121.354465, 40.488737]
  //                 }
  //             }]
  //           }
  //         });

  //               /// get source
  //       // this.source = this.map.getSource('excess')

  //         this.map.addLayer({
  //           "id": 'excess',
  //           "type": "fill",
  //           "source": 'excess',
  //           "paint": {
  //               "fill-color": "#888888",
  //               "fill-opacity": 0.5
  //           },
  //           "filter": ["==", "$type", "Polygon"]
  //         });
  //       });



        
  //     },  err => {
  //         console.log(err);
  //       });
  //   });
  // }

 
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

}
