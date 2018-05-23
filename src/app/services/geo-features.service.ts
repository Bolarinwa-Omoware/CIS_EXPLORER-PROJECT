import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {map, delay, catchError} from 'rxjs/operators'
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';



@Injectable()
export class GeoFeaturesService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService
  ) { }

  getDxf_File(path, status): Observable<any> {
    return this.http.get(`${baseURL}/geofeatures/dxf2geojson?path=${path}&status=${status}`)
    .pipe(catchError(error => this.processHTTPMsgService.handleError(error)));//throwError(error => this.processHTTPMsgService.handleError(error));
  }

}
