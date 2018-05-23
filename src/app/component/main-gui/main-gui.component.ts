import { Component, OnInit, OnDestroy } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-main-gui',
  templateUrl: './main-gui.component.html',
  styleUrls: ['./main-gui.component.css']
})
export class MainGuiComponent implements OnInit,OnDestroy {

  username: string = undefined;
  subscription: Subscription;
  page: string;

  constructor(
    private _pages:PagesService,
    private authService: AuthService 
  ) { }

  ngOnInit() {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(name => { console.log(name); this.username = name; });    

      this._pages.page.subscribe(res => this.page = res);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMe(val):void{
    val.toggle();
  }

  // sendMeHome(){
  //   window.location.reload(true);
  // }

  logOut(){
    this.username = undefined;
    this.authService.logOut();
    this._pages.setPage('Home');
  }

}
