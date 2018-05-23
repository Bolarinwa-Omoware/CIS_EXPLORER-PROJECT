import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as mapboxgl from 'mapbox-gl';
import { AuthService } from '../../services/auth.service';
import { MapboxGlService } from '../../services/mapbox-gl.service';
import { FeatureUploadComponent } from '../feature-upload/feature-upload.component';

@Component({
  selector: 'app-mapbox-page',
  templateUrl: './mapbox-page.component.html',
  styleUrls: ['./mapbox-page.component.css']
})
export class MapboxPageComponent implements OnInit, AfterViewInit {

    /// default settings
    map: mapboxgl.Map;
    style = 'mapbox://styles/ware185/cjgvzvkmg003v2rljc03ogjbi';
    lat = 6.53;
    lng = 3.55;
    message = 'Hello World!';

    // data
    source: any;
    markers: any;

    // Users role variable
    role: string;

  constructor(
    _mapboxService: MapboxGlService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.authService.userRole.subscribe(res => this.role = res);
  }

  ngAfterViewInit() { 
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });
  }

  uploadNewFeature(){
    const dialogRef = this.dialog.open(  FeatureUploadComponent, {
      width: '40%',
      height: '55vh',
      disableClose: true,
      autoFocus: true,

    });
  }

}
