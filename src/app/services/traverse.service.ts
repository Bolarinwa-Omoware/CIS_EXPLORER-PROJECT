import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TraverseData } from '../geoModels/coordinatesData';







@Injectable()
export class TraverseService  {

  private traverse_legs = new BehaviorSubject<TraverseData>(null);
  traverse_leg = this.traverse_legs.asObservable();


  private results= new BehaviorSubject<any>(null);
  finalResult = this.results.asObservable();

  constructor() {
  
  }

  addTraverse(traverse: TraverseData){
    this.traverse_legs.next(traverse);
  }

  getTraverse():TraverseData{
    return this.traverse_legs.getValue()
  }


  changeInNorthing(dist:number, bearing:number):number{
    return Math.cos(this.toRadians(bearing))*dist;
  }

  changeInEasting(dist:number, bearing:number): number{
    return Math.sin(this.toRadians(bearing))*dist;
  }

  toRadians(angle):number {
    return angle * (Math.PI / 180);
  }

  getRelativeErrorOfClosure(sumChange_E:number, sumChange_N:number, totalDistance:number):number{
    return (1/Math.sqrt((Math.pow(sumChange_E,2) + Math.pow(sumChange_N,2))))*totalDistance;
  }

  computeTraverse(data:TraverseData){
    const ce :number[]=[]; //change in eastings
    const cn :number[] =[]; //change in northings

    const initEastings :number[]= []; //initial computed eastings
    const initNorthing :number[]= []; //initial computed northings

    let initE : number = Number(data.initControl_x);
    let initN : number = Number(data.initControl_y);

    let sum_ce: number = 0; // Sum of change in Easting
    let sum_cn : number= 0; // Sum of change in Northing
    let sum_dist: number = 0; // Sum of Distances


    const finalResult = [];

    for(let i=0; i<data.bearing.length; i++){

      sum_dist = sum_dist + data.distance[i];
      let cx = this.changeInEasting(data.distance[i], data.bearing[i]);
      let cy = this.changeInNorthing(data.distance[i], data.bearing[i]);

      ce.push(cx);
      cn.push(cy);
      

      sum_ce = sum_ce + cx;
      sum_cn = sum_cn + cy;

      initE = initE + cx;
      initN = initN + cy;



      initEastings.push(initE);
      initNorthing.push(initN);

    }

    for(let k=0; k<initEastings.length; k++){
      finalResult.push({pb: data.beaconId[k], easting: initEastings[k], northing: initNorthing[k]})
    }

    console.log('ce: ', ce);
    console.log('cn: ', cn);


    let RelErrClosure = this.getRelativeErrorOfClosure(sum_ce, sum_cn, sum_dist);

    this.addFinalResult(finalResult);
  } // end of compute traverse

  addFinalResult(result){
    this.results.next(result);
  }

  getFinalResult(){
    return this.results.getValue();
  }


  
}












 