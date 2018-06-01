import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mapbox-popup',
  templateUrl: './mapbox-popup.component.html',
  styleUrls: ['./mapbox-popup.component.css']
})
export class MapboxPopupComponent implements OnInit {

  displayedColumns = ['position', 'name', 'detail'];
  @Input('SourceData') mapData;
  dataSource = new MatTableDataSource<DataFrameWork>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.mapData
    this.dataSource.paginator = this.paginator;
  }

}

export interface DataFrameWork {
  position: number;
  name: string;
  detail: string;
}
