import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


declare let $: any;

@Component({
  selector: 'app-dialog-display-result',
  templateUrl: './dialog-display-result.component.html',
  styleUrls: ['./dialog-display-result.component.css']
})
export class DialogDisplayResultComponent implements OnInit {

  pdfOutPut:any;
  constructor(
    public dialogRef: MatDialogRef<DialogDisplayResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data.pdfOutput);
    
    
   }

  ngOnInit() {
    $("#output")[0].src = this.data.pdfOutput;
  }

  onCloseClick(): void{
     this.dialogRef.close(); 
  }

}
