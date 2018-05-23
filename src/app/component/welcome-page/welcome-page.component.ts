import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PagesService } from '../../services/pages.service';


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  @Input() disabledOkBtn = false;

  public page: string;

  user = {username: '', password: ''};
  errMess: string;

  role: string;


  mapSources = [
    'ESRI ONLINE',
    'CUSTOMIZE MAP'
  ];


  constructor(
    private _pages: PagesService,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this._pages.page.subscribe(res => this.page = res);
    this.role = this.authService.getUserRole();
  }

  logMeIn(): void {

    if (this.user.password !== '' || this.user.username !== '' || this.page !== 'Home') {
      console.log('User: ', this.user);
      this.authService.logIn(this.user)
      .subscribe(res => {
        if (res.success) {
          this._pages.setPage(this.page);
        } else {
          console.log(res);
        }
      },
      error => {
        console.log(error);
        this.errMess = error;
      });
    }
   }
}
