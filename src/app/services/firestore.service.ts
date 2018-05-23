import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {ChartingResult, ChartingResultRef_Id} from '../component/appModel/chartingResult';


@Injectable()    
export class FirestoreService {

  landChartingResultCol: AngularFirestoreCollection<ChartingResult>;
  chartingResultItems: any;
  landChartingResultDoc: AngularFirestoreDocument<ChartingResult>;

 
  landChartingResult: Observable<ChartingResult>;

  constructor(public afs: AngularFirestore)
  {
    this.landChartingResultCol = this.afs.collection('LandChartingResult',
     ref => ref.orderBy('titleHolder', 'asc'));
    this.chartingResultItems = this.landChartingResultCol.snapshotChanges().map(changes =>{
      return changes.map(a=>{
        const data = a.payload.doc.data() as ChartingResult;
        const ref_id = a.payload.doc.id;
        return {ref_id, data};
      })
    });
    
  }

  getChartingResultItems(){
    return this.chartingResultItems;
  }

  addChartingResultItems(ref_id:string, item: ChartingResult){
    this.afs.collection('LandChartingResult').doc(ref_id).set(item);
  }

  getChartingResultBy_RefId(ref_id:string) {
    this.landChartingResultCol = this.afs.collection('LandChartingResult', ref => ref.where('ref_no', '==', ref_id));

    this.chartingResultItems = this.landChartingResultCol.snapshotChanges().map(changes =>{
      return changes.map(a=>{
        const data = a.payload.doc.data() as ChartingResult;
        const ref_id = a.payload.doc.id;
        return {ref_id, data};
      })
    });
    return this.chartingResultItems;
    // this.landChartingResultDoc = this.afs.doc('LandChartingResult/'+ref_id);
    // return this.landChartingResultDoc.valueChanges();
    
  }

  deleteChartingResultItems_byRefId(ref_id:string){
    this.landChartingResultDoc = this.afs.doc(` LandChartingResult/${ref_id}`);
    this.landChartingResultDoc.delete();
  }

  updateChartingResultItems(ref_id:string, item: ChartingResult){
    this.landChartingResultDoc = this.afs.doc(`LandChartingResult/${ref_id}`);
    this.landChartingResultDoc.update(item);
  }

}


