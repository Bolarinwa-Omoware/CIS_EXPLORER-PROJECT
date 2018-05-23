import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cert-verify-dialog',
  templateUrl: './cert-verify-dialog.component.html',
  styleUrls: ['./cert-verify-dialog.component.css']
})
export class CertVerifyDialogComponent implements OnInit {

  ref_id: string;
  closeStatus:string = "close";

  constructor(
    public dialogRef: MatDialogRef<CertVerifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.ref_id = data.ref_id;

  }

  ngOnInit() {
  }

  processData(){
    this.data.ref_id = this.ref_id
    this.dialogRef.close(this.data);
  }


  onCloseClick(): void{
    this.dialogRef.close(); 
 }

}
