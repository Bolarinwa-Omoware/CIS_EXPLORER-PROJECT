import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { forkJoin } from 'rxjs';
import { NewFeatureFile } from '../../formSubmitionModel/newFeatureModel';
import { MongodbService } from '../../services/mongodb.service';
import { PagesService } from '../../services/pages.service';
import { baseURL } from '../../shared/baseurl';

@Component({
  selector: 'app-feature-upload',
  templateUrl: './feature-upload.component.html',
  styleUrls: ['./feature-upload.component.css']
})
export class FeatureUploadComponent implements OnInit {

  @ViewChild('file') file;
  public files: Set<File> = new Set();

  layerName: string = undefined;
  projectionType: string = undefined;

  formFields: NewFeatureFile;

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;

  
  uploadSuccessful = false;

  formFieldNotFill:boolean = true;

  public uploadStatus: string;

  constructor(
    public dialogRef: MatDialogRef<FeatureUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _pages: PagesService,
    private uploadFeatureService: MongodbService
  ) { }

  ngOnInit() {
    this._pages.uploadStatus.subscribe(res => this.uploadStatus = res);
  }

  checkFormStatus(){

    if ((this.layerName!== undefined || this.layerName !== '') && (this.projectionType !==undefined || this.projectionType !== '')) {
      this.formFieldNotFill = false;
    }
    
    // if(this.layerName !== undefined && this.projectionType !== undefined){
    //   this.formFieldNotFill = false;
    // }else{
    //   this.formFieldNotFill = true;
    // }
   
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

    this.formFields= {
      name: this.layerName.trim(),
      projection: this.projectionType,
      files: this.files
    }
    

    // set the component state to "uploading"
    this.uploading = true;

    // this.fields.push(this.layerName,this.projectionType)
    // start the upload and save the progress map
    

    this.progress = this.uploadFeatureService.upload(
      `${baseURL}mongodbServer?name=${this.formFields.name.trim()}
      &projection=${this.formFields.projection}`,this.formFields);


    // // convert the progress map into an array
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

  onCloseClick(): void { this.dialogRef.close();  }

}
