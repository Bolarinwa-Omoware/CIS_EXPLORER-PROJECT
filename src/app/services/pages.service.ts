import { Injectable } from '@angular/core';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PagesService {

  private pages = new BehaviorSubject<any>('Home');
  page = this.pages.asObservable();

  private uploadStatuss = new BehaviorSubject<any>('loading');
  
  uploadStatus = this.uploadStatuss.asObservable();

  private methods = new BehaviorSubject<any>('QUERY BY COORDINATES METHOD');
  method = this.methods.asObservable();

  constructor() { }

  setPage(page) {
   this.pages.next(page);
  }

  setUploadStatus(status){
    this.uploadStatuss.next(status);
  }

  setMethod(method) {
    this.methods.next(method);
   }

  getCurrentPage() {
    return this.pages.getValue();
  }

  getCurrentMethod() {
    return this.methods.getValue();
  }

  getUploadStatus() {
    return this.uploadStatuss.getValue();
  }

}
