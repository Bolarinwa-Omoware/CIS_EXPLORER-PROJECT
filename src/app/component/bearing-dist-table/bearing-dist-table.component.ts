import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TraverseService } from '../../services/traverse.service';
import { Observable } from 'rxjs/Observable';
import { TraverseData } from '../../geoModels/coordinatesData';
import { map } from 'rxjs/operators/map';
import { PagesService } from '../../services/pages.service';
declare let $: any;

@Component({
  selector: 'app-bearing-dist-table',
  templateUrl: './bearing-dist-table.component.html',
  styleUrls: ['./bearing-dist-table.component.css']
})
export class BearingDistTableComponent implements OnInit {

 
  uploadStatus: string;
  startingEasting;
  startingNorthing;
  finalEasting;
  finalNorthing;
  beaconId_init;
  beaconId_final;

  traverse_legs: TraverseData;
  closingMethod: string;


  constructor(
    private traverseService: TraverseService,
    private _pages: PagesService
  ) { 
      
  }

  ngOnInit() {
    this.traverseService.traverse_leg.subscribe(res => this.traverse_legs = res);  
    this._pages.uploadStatus.subscribe(res => this.uploadStatus = res);  
    const $TABLE = $('#polygonSearchTable');
    // const $BTN = $('#search-btn');

    $('.table-add').click(function () {

      const $clone = $TABLE.find('tr.hide2').clone(true).removeClass('hide2 table-line');
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

  computeTraverse(){
    const $TABLE = $('#polygonSearchTable');
    // this.beaconId = [];
    // this.coordinatesData = [];
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

    const stn_ids = [];
    const distances:number[] = [];
    const bearings: number[]= [];

    data.forEach(leg=>{
      stn_ids.push(leg.to_stn_id);
      distances.push(Number(leg.distance));
      let bearing = Number(leg.deg) + (Number(leg.min)/60) + (Number(leg.sec/3600));
      bearings.push(bearing);
    });

    this.traverse_legs = {
      beaconId: stn_ids,
      distance: distances,
      bearing: bearings,
      initControl_x: Number(this.startingEasting),
      initControl_y: Number(this.startingNorthing),
      finalControl_x: Number(this.finalEasting),
      finalControl_y: Number(this.finalNorthing),
      initControl_id: this.beaconId_init,
      finalControl_id: this.beaconId_final

    }

    console.log(this.traverse_legs);

    this.traverseService.addTraverse(this.traverse_legs);

    this.traverseService.computeTraverse(this.traverse_legs);
    this._pages.setUploadStatus('loadData');
    

  }


  
}
