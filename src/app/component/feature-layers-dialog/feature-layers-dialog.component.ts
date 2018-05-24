import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-feature-layers-dialog',
  templateUrl: './feature-layers-dialog.component.html',
  styleUrls: ['./feature-layers-dialog.component.css']
})
export class FeatureLayersDialogComponent implements OnInit {


  layerName: string;
  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<FeatureLayersDialogComponent>
  ) { }

  ngOnInit() {

    
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  changeLayer(){
    console.log(this.layerName);
    
  }

}
