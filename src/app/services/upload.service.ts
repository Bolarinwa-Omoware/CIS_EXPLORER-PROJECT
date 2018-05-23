import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CSVJson_Data, Coordinates, GeoJson_Data } from '../geoModels/coordinatesData';


@Injectable()
export class UploadService {


  coordinate;
  constructor(
    private http: HttpClient) {

   }

  public getJsonFile(url: string): Observable<Coordinates>{
    return this.http.get<Coordinates>(url);
 
  }

  public getCSVJsonFile(url: string): Observable<CSVJson_Data>{
    return this.http.get<CSVJson_Data>(url);
 
  }


  public getGeoJsonFile_shapefile(url: string): Observable<[GeoJson_Data]>{
    return this.http.get<[GeoJson_Data]>(url);
  }



  public upload(url: string, files: Set<File>): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // if(fieldParameter.length >0){
        
      //   formData.append('file', file, file.name);
      //   formData.append('name', fieldParameter[0]);
      //   formData.append('projection', fieldParameter[1]);

      // }else {
        
      // }
     
      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }

}
