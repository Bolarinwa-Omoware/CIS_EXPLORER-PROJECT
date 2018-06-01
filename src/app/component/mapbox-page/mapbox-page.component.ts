import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { Map, Popup } from 'mapbox-gl';
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
    map: Map;

     // data
     mapDataSource = [];
     mapDataSourceLayer = [];
     

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
    this.mongodbServer.featureLayer.subscribe((res)=>{
      console.log(res);
      
      this.mapDataSourceLayer = res;
    });
    this.mongodbServer.geoFeatureData.subscribe((res)=> this.mapDataSource = res);

  }

  ngAfterViewInit(): void {
    // this.initializeMap(); 
    // console.log(this.map);
  }

  onLoad(mapInstance: Map){
    this.map = mapInstance;
    let index = 0;
    
    this.mapDataSourceLayer.forEach(layer=>{  
      
      if(layer[1].search("EXCESS") === -1){
        this.addLayer2MapView(mapInstance,layer[1],index,"#3CB371","#008000");
      }else{
        this.addLayer2MapView(mapInstance,layer[1],index,"#FF0000","#FF0000");
      }
      console.log(index);
      
      index++;
    });

    
  }


  addLayer2MapView(mapInstance:Map, layer:string, index:number, color:string,hoverColor:string){
    mapInstance.addLayer({
      "id": layer+"fill",
      "type": "fill",
      "source": this.mapDataSource[index],
      "layout": {},
      "paint": {
          "fill-color": color,
          "fill-opacity": 0.5
      }
    });

    mapInstance.addLayer({
        "id": layer+"line",
        "type": "line",
        "source": this.mapDataSource[index],
        "paint": {
          "line-color": hoverColor,
          "line-width": 1
        }
    });

    mapInstance.addLayer({
      "id": layer+"hover",
      "type": "fill",
      "source": this.mapDataSource[index],
      "layout": {},
      "paint": {
          "fill-color": hoverColor,
          "fill-opacity": 1
      },
      "filter": ["==", "_id", ""]
    });

    this.activateHoverOn(mapInstance,layer+"fill",layer+"hover","_id");
    this.disableHover(mapInstance,layer+"fill",layer+"hover","_id");
  }

  activateHoverOn(map:Map, moveOn:string, hoverOn:string, filterVal:string) {
    // When the user moves their mouse over the states-fill layer, we'll update the filter in
    // the state-fills-hover layer to only show the matching state, thus making a hover effect.
    this.map.on("mousemove", moveOn, function(evt) {
      
      map.setFilter(hoverOn, ["==", filterVal, evt.features[0].properties[filterVal]]);
      
    });
  }

  disableHover(map:Map, moveOn:string, hoverOn:string, filterVal:string) {
    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    this.map.on("mouseleave", moveOn, function() {
      map.setFilter(hoverOn, ["==", filterVal, ""]);
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


  format2Geojson(data: any):FeatureCollection{
    
    let features:Array<GeoJson> = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let fea = new GeoJson(element.geometry.coordinates, element.properties);
      features.push(fea);
    }

    return new FeatureCollection(features);
  }

    // When a click event occurs on a feature in the specified layer, open a popup at the
    // location of the feature, with description HTML from its non-spatial properties.

    popUp_OnMouseClick(map:Map, targetLayer:string, properties:Object){
      const popup = new Popup();
      map.on('click', targetLayer, (e)=> {

      });
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
