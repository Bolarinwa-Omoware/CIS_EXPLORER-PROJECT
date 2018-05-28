import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';






@Injectable()
export class MapboxGlService {

  map: mapboxgl.Map;

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  initializeMap(container:string, style:string, center:Array<number>, zoom: number){

    return new Promise((resolve,rejected)=>{
      setTimeout(()=>{
        this.map = this.createMapInstance(container, style, center, zoom);
        resolve();
      },1000)
    });

  }

  // onMapLoad(map){
  //   return new Promise((res, rej)=>{
  //     map.on("load", res); 
  //   });
  // }


  // addMapSource(name:string, data:any, map){
  //   return new Promise((resolve,reject)=>{
  //     map.addSource(name, data);

  //     resolve(map);

  //   });
  // }

  private createMapInstance(container:string, style:string, center:Array<number>, zoom: number){
    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v9",
      center: center,
      zoom: zoom
    });
  }
}

