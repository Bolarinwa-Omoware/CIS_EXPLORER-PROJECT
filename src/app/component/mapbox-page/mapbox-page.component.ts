

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog, MatTableDataSource } from '@angular/material';
import { Map, Popup } from 'mapbox-gl';
import { FeatureCollection, GeoJson } from '../../geoModels/geo-model';
import { AuthService } from '../../services/auth.service';
import { MapboxGlService } from '../../services/mapbox-gl.service';
import { MongodbService } from '../../services/mongodb.service';
import { DataFrameWork } from '../../shared/popupModel';
import { FeatureLayersDialogComponent } from '../feature-layers-dialog/feature-layers-dialog.component';
import { FeatureUploadComponent } from '../feature-upload/feature-upload.component';



//  let $: any;


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
    //  popupData:DataFrameWork[] = [{
    //   position: 1,
    //   name: "BLOCK_ID",
    //   detail: "DATA MAPPING STRATEGY"
    // }];

    popupData = new MatTableDataSource<DataFrameWork>([{position: 1, name: "DETAIL 1", detail: "JUST A TEST HERE"}]);
     

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
      this.mapDataSourceLayer = res;
    });
    this.mongodbServer.geoFeatureData.subscribe((res)=> {
      this.mapDataSource = res
      console.log(this.mapDataSource);
      
    });
  }

  ngAfterViewInit(): void {

  }

  onLoad(mapInstance: Map){
    this.map = mapInstance;
    let index = 0;
    
    this.mapDataSourceLayer.forEach(layer=>{  
      
      if(layer[1].search("EXCESS") === -1){
        this.addLayer2MapView(mapInstance,layer[1],index,"#3CB371","#008000");
      }else{

          this.addLayer2MapView(mapInstance,layer[1],index,"#FF0000","#FF0000");
  
          // When a click event occurs on a feature in the places layer, open a popup at the
          // location of the feature, with description HTML from its properties.
          mapInstance.on('click', layer[1]+"fill", function (e) {
            // var coordinates = e.features[0].geometry.coordinates.slice();
            var data = e.features[0].properties;

            const description = `
            <style>

                table{
                  height: 20px;
                }
                #popupId {
                    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                }
                
                #popupId td, #popupId th {
                    border: 1px solid #ddd;
                    padding: 4px;
                }
                
                #popupId tr:nth-child(even){background-color: #f2f2f2;}
                
                #popupId tr:hover {background-color: #ddd;}
                
                #popupId th {
                    padding-top: 6px;
                    padding-bottom: 6px;
                    text-align: left;
                    background-color: #4CAF50;
                    color: white;
                }
                </style>
              <table id="popupId">
      
                <tr>
                  <th>S/N</th>
                  <th>NAME</th>
                  <th>DETAIL</th>
                </tr>
                <tr>
                  <td> 1.</td>
                  <td> ESTATE </td>
                  <td> ${data["ESTATE"]}</td>
                </tr>

              <tr>
                <td> 2.</td>
                <td> BLOCK ID </td>
                <td> ${data["BLOCK_ID"]}</td>
              </tr>
              <tr>
                <td> 3.</td>
                <td> EXCESS PLOT NUMBER </td>
                <td> ${data["EX_PLOT_NO"]}</td>
              </tr>

            <tr>
              <td> 4.</td>
              <td> STREET NAME </td>
              <td> ${data["STREET_NAM"]}</td>
            </tr>
  
            <tr>
              <td> 5.</td>
              <td> EXCESS AREA TAKEN (SqM) </td>
              <td> ${data["EX_SIZE"]}</td>
            </tr>
            <tr>
              <td> 6.</td>
              <td> ADMINISTRATIVE CHARGES </td>
              <td> ${data["ADM_CHARGE"]}</td>
            </tr>

            <tr>
              <td> 7.</td>
              <td> ANNUAL GROUND RENT </td>
              <td> ${data["ANN_GRent"]}</td>
            </tr>

            
            <tr>
              <td> 9.</td>
              <td> CAPITAL CONTRIBUTION </td>
              <td> ${data["CAP_CONB"]}</td>
            </tr>

            
            <tr>
              <td> 10.</td>
              <td> LAND CHARGES </td>
              <td> ${data["LandCharge"]}</td>
            </tr>

            
            <tr>
              <td> 11.</td>
              <td> NORMAL PREMIUM </td>
              <td> ${data["NOR_PREMIU"]}</td>
            </tr>

            
            <tr>
              <td> 12.</td>
              <td> RATE PER SQ. METERS </td>
              <td> ${data["RATE_PSqM"]}</td>
            </tr>

            <tr>
              <td> 13.</td>
              <td> STAMP DUTY </td>
              <td> ${data["STAMP_DUTY"]}</td>
            </tr>

            <tr>
              <td> 14.</td>
              <td> REGISTRATION FEE </td>
              <td> ${data["RegConvFee"]}</td>
            </tr>

            <tr>
              <td> 15.</td>
              <td> SURVEY FEE </td>
              <td> ${data["SURVEY_FEE"]}</td>
            </tr>

            <tr>
              <td> 16.</td>
              <td> AMOUNT PAYABLE </td>
              <td> ${data["AMT_PAYABL"]}</td>
            </tr>

            <tr>
              <td> 17.</td>
              <td> DELIVERY STATUS </td>
              <td> ${data["DELIV_STAT"]}</td>
            </tr>

            <tr>
              <td> 18.</td>
              <td> REMARK </td>
              <td> ${data["REMARK"]}</td>
            </tr>

          </table>
          `
      
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            // }
      
            new Popup()
                .setLngLat(e.lngLat)
                .setHTML(description)
                .addTo(mapInstance);
          });
  
          // Change the cursor to a pointer when the mouse is over the places layer.
          mapInstance.on('mouseenter', layer[1]+"fill", function () {
            mapInstance.getCanvas().style.cursor = 'pointer';
          });
  
          // Change it back to a pointer when it leaves.
          mapInstance.on('mouseleave', layer[1]+"fill", function () {
            mapInstance.getCanvas().style.cursor = '';
          });
      }
      
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

    this.activateSelect(mapInstance,"mousemove",layer,"_id");
    this.disableSelect(mapInstance,"mouseleave", layer,"_id");
    // this.popUp_OnMouseClick(mapInstance,{},layer,"_id");
    // this.changeMousePointer(mapInstance,layer);
    // this.removeMousePointer(mapInstance,layer);
  }

  activateSelect(map:Map, event:string, targetLayer:string, filterVal:string) {
    // When the user moves their mouse over the states-fill layer, we'll update the filter in
    // the state-fills-hover layer to only show the matching state, thus making a hover effect.
    this.map.on(event, targetLayer+"fill", function(evt) {
      
      map.setFilter(targetLayer+"hover", ["==", filterVal, evt.features[0].properties[filterVal]]);
      
    });
  }

  disableSelect(map:Map, event:string, targetLayer:string, filterVal:string) {
    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    this.map.on(event,targetLayer+"fill", function() {
      map.setFilter(targetLayer+"hover", ["==", filterVal, ""]);
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

    popUp_OnMouseClick(map:Map,properties:Object, targetLayer:string, filterVal:string){
      const popup = new Popup();
      // let popEle = $('#popupId');
      // var div = window.document.createElement('div');
      
      // div.innerHTML = des;
      map.on('click', targetLayer+"fill", (e)=> {
        // console.log(turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]));
        // console.log(e);
        // this.popupData.push({
        //   position: 1,
        //   name: "BLOCK_ID",
        //   detail: e.features[0].properties["BLOCK_ID"]
        // }) //e.features[0].properties

        // console.log(this.popupData);

        console.log(e.features[0].properties.length);
        

        let des = `<table> <tr> <th>Name</th> <th>Favorite Color</th> </tr> <tr> <td>Bob</td> <td>Yellow</td> </tr> <tr> <td>Michelle</td> <td>Purple</td> </tr> </table>`;
        
        popup.setLngLat(e.lngLat).setHTML(des).addTo(map);

        this.activateSelect(map,'click',targetLayer,filterVal);
        this.disableSelect(map,"mouseleave", targetLayer, filterVal);
      });
      
    }

    // Change the cursor to a pointer when the mouse is over the places layer.
    changeMousePointer(map:Map, targetLayer:string){
      map.on('mouseenter', targetLayer+"fill", function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    }

    removeMousePointer(map:Map, targetLayer:string){
      map.on('mouseleave', targetLayer+"fill", function () {
        map.getCanvas().style.cursor = '';
      });
    }


    createMapExcessPopUp(data):string{
      return `
        <style>
            #popupId {
                font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }
            
            #popupId td, #popupId th {
                border: 1px solid #ddd;
                padding: 8px;
            }
            
            #popupId tr:nth-child(even){background-color: #f2f2f2;}
            
            #popupId tr:hover {background-color: #ddd;}
            
            #popupId th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                background-color: #4CAF50;
                color: white;
            }
            </style>
          <table id="popupId">
  
            <tr>
              <th>S/N</th>
              <th>NAME</th>
              <th>DETAIL</th>
            </tr>
            <tr>
              <td> 1.</td>
              <td> ESTATE </td>
              <td> data["ESTATE"]</td>
            </tr>

          </table>
      `
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
