import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-welcome-dialog',
  templateUrl: './welcome-dialog.component.html',
  styleUrls: ['./welcome-dialog.component.css']
})
export class WelcomeDialogComponent implements OnInit {

  @Input() disabledOkBtn : boolean = true;

  source: string = "";

  title: string = "EMAPPER 2018"

  mapSources = [
    'ESRI ONLINE',
    'CUSTOMIZE MAP'
  ];

  constructor(
    public dialogRef: MatDialogRef< WelcomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
 
   }

  ngOnInit() {
    // this.data.source = this.source;
  }

  onCloseClick(): void{
    this.dialogRef.close(this.source); 
 }

 getStatus(): void{
  this.disabledOkBtn = false;
 }

}
