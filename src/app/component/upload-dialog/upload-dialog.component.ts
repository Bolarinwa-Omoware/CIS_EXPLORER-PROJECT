import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { forkJoin } from 'rxjs/observable/forkJoin';
import { UploadService } from '../../services/upload.service';
import { PagesService } from '../../services/pages.service';


let url1 = 'http://localhost:8080/upload/?proj=0';
let url2 =  'http://localhost:8080/upload/:csvFile/shapefile';
let url3 = 'http://localhost:8080/upload/:csvFile';

// let url1 = 'https://utilityserver-202910.appspot.com/upload?proj=0';
// let url2 =  'https://utilityserver-202910.appspot.com/uploadzip';
// let url3 = 'https://utilityserver-202910.appspot.com/uploadCSV';


@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {

  @ViewChild('file') file;
  public files: Set<File> = new Set();

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  public uploadStatus: string;

  fieldParameter:[string];

  public method;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    public uploadService: UploadService,
    private _pages: PagesService,
  ) { }

  ngOnInit() {
    this._pages.uploadStatus.subscribe(res => this.uploadStatus = res);
    this._pages.method.subscribe(res => this.method = res);
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      this._pages.setUploadStatus('loadFinished');
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    if(this.method === 'QUERY USING IMPORTED SHAPEFILE'){
    // start the upload and save the progress map
    this.progress = this.uploadService.upload(url2,this.files);
    }
    else if(this.method === 'QUERY USING IMPORTED AUTOCAD DXF-FILE'){
    // start the upload and save the progress map
    this.progress = this.uploadService.upload(url1,this.files);
    }
    else if(this.method === 'QUERY USING IMPORTED CSVFILE'){
      // start the upload and save the progress map
      this.progress = this.uploadService.upload(url3,this.files);
    }



    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }

}
