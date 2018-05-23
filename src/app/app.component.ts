import { Component, OnInit  } from '@angular/core';
import { WelcomeDialogComponent } from './component/welcome-dialog/welcome-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PagesService } from './services/pages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  

  private dialogRef: MatDialogRef<WelcomeDialogComponent, any>;
  page:string;

  constructor(
    public dialog: MatDialog,
    private _pages: PagesService
  ){
    
    // this.source = _pages.getCurrentPage();
    // const dialogRef = this.dialog.open(WelcomeDialogComponent, {
    //   width: '60%',
    //   height: '500',
    //   disableClose: true,
    //   // direction: 'rtl',
    //   autoFocus: true,
    //   data: {
    //     source: ''
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   _pages.changePage(result);
    //   this.source = _pages.getCurrentPage();
    //   console.log(this.source);
      
    //  });

  }

  ngOnInit(){
    this._pages.page.subscribe(res => this.page = res);
  }

  // loginClicked(eventArg):void{

  //   if(eventArg.target.id ==='login' || eventArg.target.id ==='login1' || eventArg.target.id ==='login2' ){
  //     // console.log(this.source );
  //     // this._pages.changePage(this.source);
  //     // this.source = this._pages.getCurrentPage();
  //     // console.log(this.source );
  //   }
  // }
    



}
