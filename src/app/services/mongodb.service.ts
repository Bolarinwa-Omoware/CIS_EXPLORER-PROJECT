import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NewFeatureFile } from '../formSubmitionModel/newFeatureModel';
import { FeatureCollection, GeoJson } from '../geoModels/geo-model';
import { baseURL } from '../shared/baseurl';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class MongodbService {

  // private documents = new BehaviorSubject<any>([]);
  // document = this.documents.asObservable();

  coordinate;
  constructor(
    private http: HttpClient
  ) {

    }

  //  setDocument(doc) {
  //   this.documents.next(doc);
  //  }

   
/**
 * Function for uploading file into the server and for deploying its content into 
 * mongodb database.
 * 
 * @param url url to the server
 * @param files file to be uploaded into the server
 */
  public upload(url: string, files:NewFeatureFile): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};

    files.files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST',url, formData, {
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


/**
 * Add all CRUD (create, read, update, delete) functions of geoFeature document in mongodb.
 */

 getAllGeoFeatureCollection(): Observable<any> {
   return this.http.get(baseURL+'mongodbServer', httpOptions).pipe(
     map(this.extractData),
     catchError(this.handleError)
   );
  }

  getGeoFeatureCollectionById(id:string): Observable<any> {
    return this.http.get(baseURL+'mongodbServer/'+id, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
   }


/**
 * Add a function for extract response data.
 * @param res 
 */
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

/**
 * Add the error handle function.
 * @param error 
 */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };



}
