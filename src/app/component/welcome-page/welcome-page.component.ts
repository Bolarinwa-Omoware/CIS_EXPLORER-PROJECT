import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MongodbService } from '../../services/mongodb.service';
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

  mapDataSource = [];


  constructor(
    private _pages: PagesService,
    private authService: AuthService,
    private mongoService: MongodbService
  ) {

  }

  ngOnInit() {
    this._pages.page.subscribe(res => this.page = res);
    this.role = this.authService.getUserRole();

    this.mongoService.getGeoFeatureCollectionById('5b0c24ebceebb401c863715d').subscribe(res=>{
      let source = {
        type: 'geojson',
        data: res
      }
      this.mapDataSource.push(source);
      this.mongoService.addGeoFeature(this.mapDataSource);
    });
    this.mongoService.getGeoFeatureCollectionById('5b0c1caa8c117929b411783b').subscribe(res=>{
      let source = {
        type: 'geojson',
        data: res
      }
      this.mapDataSource.push(source);
      this.mongoService.addGeoFeature(this.mapDataSource);
    });

    this.mongoService.getGeoFeatureCollectionById('5b0befa6d6d3ec218c1c15e7').subscribe(res=>{
      let source = {
        type: 'geojson',
        data: res
      }
      this.mapDataSource.push(source);
      this.mongoService.addGeoFeature(this.mapDataSource);
    });

    this.mongoService.addGeoFeature(this.mapDataSource);

}

  logMeIn(): void {

    if (this.user.password !== '' || this.user.username !== '' || this.page !== 'Home') {
      // console.log('User: ', this.user);
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
