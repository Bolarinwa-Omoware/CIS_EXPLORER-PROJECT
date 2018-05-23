import { Injectable } from '@angular/core';


import { GeoJson } from '../geoModels/geo-model';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';

@Injectable()
export class MapboxGlService {

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

}
