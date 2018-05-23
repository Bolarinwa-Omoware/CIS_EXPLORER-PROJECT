import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { UploadDialogComponent } from '../../component/upload-dialog/upload-dialog.component';
import { Coordinate } from '../../geoModels/coordinatesData';
import { PagesService } from '../../services/pages.service';
import { TraverseService } from '../../services/traverse.service';
import { UploadService } from '../../services/upload.service';

declare let $: any;

let url1 = 'http://localhost:8080/upload/?proj=0';
let url2 =  'http://localhost:8080/upload/:csvFile/shapefile';
let url3 = 'http://localhost:8080/upload/:csvFile';

// let url1 = 'https://utilityserver-202910.appspot.com/upload?proj=0';
// let url2 =  'https://utilityserver-202910.appspot.com/uploadzip';
// let url3 = 'https://utilityserver-202910.appspot.com/uploadCSV';




@Component({
  selector: 'app-dialog-by-coordinates',
  templateUrl: './dialog-by-coordinates.component.html',
  styleUrls: ['./dialog-by-coordinates.component.css']
})
export class DialogByCoordinatesComponent implements OnInit {


  public beaconId;
  public coordinatesData;
  public attributeData;

  public method: string;
  public uploadStatus: string;

  public titleHolder: string;
  public surveyPlanNo: string;
  public streetName: string;
  public town_vallage: string;
  public cityName: string;
  public surveyBy: string;
  public dateOfSurvey: string;
  public email: string;
  public phoneNo: string;
  

  displayedColumns = ['pb','easting', 'northing'];
  dataSource: Coordinate[]= [];

  traverseDataSource: Coordinate[]= [];

  // traverse_legs;
  

  constructor(
    public dialog: MatDialog,
    public uploadService: UploadService,
    private _pages: PagesService,
    private traverseService: TraverseService,
    public dialogRef: MatDialogRef<DialogByCoordinatesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.beaconId = data.beaconId;
    this.attributeData = data.attributeData;
    this.coordinatesData = data.coordinatesData;
   }

  ngOnInit() {
    this.traverseService.finalResult.subscribe(res=> this.traverseDataSource = res);
    this._pages.method.subscribe(res => this.method = res);
    this._pages.uploadStatus.subscribe(res => this.uploadStatus = res);
    if(this.method === 'QUERY BY COORDINATES METHOD'){
      $("#byCoord").css({"display": "block"});
    }

    const $TABLE = $('#polygonSearchTable');
    const $BTN = $('#search-btn');

    $('.table-add').click(function () {

      const $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
      $TABLE.find('table').append($clone);
    });

    $('.table-remove').click(function () {
      $(this).parents('tr').detach();
    });

    $('.table-up').click(function () {
      const $row = $(this).parents('tr');

      // tslint:disable-next-line:curly
      if ($row.index() === 1) return; // Don't go above the header
      $row.prev().before($row.get(0));
    });

    $('.table-down').click(function () {
      const $row = $(this).parents('tr');
      $row.next().after($row.get(0));
    });

    // A few jQuery helpers for exporting only
    $.fn.pop = [].pop;
    $.fn.shift = [].shift;


  }


  public openUploadDialog() {
    let dialogRef = this.dialog.open(UploadDialogComponent, { width: '35%', height: '40%' });
  }

  processFile(){

    this.beaconId = [];
    this.coordinatesData = [];
    
    this.uploadService.getJsonFile(url1).subscribe(res => {
      
      const coord: any = res.features[0].geometry.coordinates["0"];
   
      
      for(let i=0; i<coord.length; i++){
        this.beaconId.push('pb'+ i+1);
        this.coordinatesData.push(coord[i]);
        let store:Coordinate = {
          pb: 'pb'+ (i+1),
          easting: coord[i][0].toFixed(3),
          northing: coord[i][1].toFixed(3)
        }
        this.dataSource.push(store);
      }
      


      this._pages.setUploadStatus('loadData')
    });
    
  }

  processCSVFile(){

    this.uploadService.getCSVJsonFile(url3).subscribe(res =>{
      
      this.beaconId = res.pb;
      this.coordinatesData = res.coordinates[0];

      for(let i=0; i<this.beaconId.length; i++){
        let store:Coordinate = {
          pb: this.beaconId[i],
          easting: this.coordinatesData [i][0].toFixed(3),
          northing: this.coordinatesData [i][1].toFixed(3)
        }
        this.dataSource.push(store);
      }

      this._pages.setUploadStatus('loadData');
      
    });
  }

  processShapeFile(){

    this.beaconId = [];
    this.coordinatesData = [];


    this.uploadService.getGeoJsonFile_shapefile(url2).subscribe(res=>{
      const coord = res[0].coordinates[0];
      for(let i=0; i<coord.length; i++){
        this.beaconId.push('pb'+ (i+1));
        this.coordinatesData.push(coord[i]);
        let store:Coordinate = {
          pb: 'pb'+ (i+1),
          easting: coord[i][0].toFixed(3),
          northing: coord[i][1].toFixed(3)
        }
        this.dataSource.push(store);
      }
      
      // console.log(this.dataSource);

      this._pages.setUploadStatus('loadData')
    });
  }


  processData() {

    if(this.method === 'QUERY USING IMPORTED AUTOCAD DXF-FILE' 
        || this.method === 'QUERY USING IMPORTED SHAPEFILE'
        || this.method === 'QUERY USING IMPORTED CSVFILE' ){
      this.attributeData = [
        this.titleHolder,
        this.surveyPlanNo,
        this.streetName,
        this.town_vallage,
        this.cityName,
        this.surveyBy,
        this.dateOfSurvey,
        this.phoneNo
      ];
    
      this.data = {
        beaconId: this.beaconId,
        coordinatesData: this.coordinatesData,
        attributeData: this.attributeData
      };
    
      this.dialogRef.close(this.data);
    }
    else if(this.method === 'QUERY USING BEARING AND DISTANCES'){

      this.traverseDataSource.forEach(res=>{
        this.beaconId.push(res.pb);
        this.coordinatesData.push([res.easting,res.northing])
      })
      this.attributeData = [
        this.titleHolder,
        this.surveyPlanNo,
        this.streetName,
        this.town_vallage,
        this.cityName,
        this.surveyBy,
        this.dateOfSurvey,
        this.phoneNo
      ];

      this.data = {
        beaconId: this.beaconId,
        coordinatesData: this.coordinatesData,
        attributeData: this.attributeData
      };

      this.dialogRef.close(this.data);
    }
    else if(this.method === 'QUERY BY COORDINATES METHOD'){
      const $TABLE = $('#polygonSearchTable');
      this.beaconId = [];
      this.coordinatesData = [];
      // PLOTS.visible = false;
      const $rows = $TABLE.find('tr:not(:hidden)');
      const headers = [];
      const data = [];
  
      // Get the headers (add special header logic here)
      $($rows.shift()).find('th:not(:empty)').each(function () {
        headers.push($(this).text().toLowerCase());
      });
  
      // Turn all existing rows into a loopable array
      $rows.each(function () {
        const $td = $(this).find('td');
        const h = {};
  
        // Use the headers from earlier to name our hash keys
        headers.forEach(function (header, i) {
          h[header] = $td.eq(i).text();
        });
  
        data.push(h);
      });
  
      data.forEach(item => {
        const pb = item.stn_id;
        const x = Number(item.easting);
        const y = Number(item.northing);
        this.beaconId.push(pb);
        this.coordinatesData.push([x, y]);
  
      }); // END OF FOR EACH
  
      this.attributeData = [
        this.titleHolder,
        this.surveyPlanNo,
        this.streetName,
        this.town_vallage,
        this.cityName,
        this.surveyBy,
        this.dateOfSurvey,
        this.phoneNo
      ];
  
      this.data = {
        beaconId: this.beaconId,
        coordinatesData: this.coordinatesData,
        attributeData: this.attributeData
      };

  
      this.dialogRef.close(this.data);
    }
   
  }


  onCloseClick(): void { this.dialogRef.close(this.data);  }


}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
