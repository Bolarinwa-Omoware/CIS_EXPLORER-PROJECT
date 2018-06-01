import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DataFrameWork } from '../../shared/popupModel';

@Component({
  selector: 'app-mapbox-popup',
  templateUrl: './mapbox-popup.component.html',
  styleUrls: ['./mapbox-popup.component.css']
})
export class MapboxPopupComponent implements OnInit {

  displayedColumns = ['position', 'name', 'detail'];
   
   @Input('SourceData') dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    // this.dataSource.data = this.mapData
    this.dataSource.paginator = this.paginator;
  }

}


