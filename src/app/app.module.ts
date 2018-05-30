import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSliderModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { RestangularModule } from 'ngx-restangular';
import { ImageDataFile } from '.././app/component/appModel/imageDataFile';
import { PdfReporter } from '.././app/component/appModel/pdfReporter';
import { ProjectionModel } from '.././app/component/appModel/projectionModel';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { BearingDistTableComponent } from './component/bearing-dist-table/bearing-dist-table.component';
import { CertVerifyDialogComponent } from './component/cert-verify-dialog/cert-verify-dialog.component';
import { DialogByCoordinatesComponent } from './component/dialog-by-coordinates/dialog-by-coordinates.component';
import { DialogDisplayResultComponent } from './component/dialog-display-result/dialog-display-result.component';
import { EsriMapComponent } from './component/esri-map/esri-map.component';
import { FeatureLayersDialogComponent } from './component/feature-layers-dialog/feature-layers-dialog.component';
import { FeatureUploadComponent } from './component/feature-upload/feature-upload.component';
import { MainGuiComponent } from './component/main-gui/main-gui.component';
import { MapboxPageComponent } from './component/mapbox-page/mapbox-page.component';
import { StatusDialogComponent } from './component/status-dialog/status-dialog.component';
import { UploadDialogComponent } from './component/upload-dialog/upload-dialog.component';
import { WelcomeDialogComponent } from './component/welcome-dialog/welcome-dialog.component';
import { WelcomePageComponent } from './component/welcome-page/welcome-page.component';
import { AuthInterceptor, UnauthorizedInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { EsriMapService } from './services/esri-map.service';
import { FirestoreService } from './services/firestore.service';
import { MapboxGlService } from './services/mapbox-gl.service';
import { MongodbService } from './services/mongodb.service';
import { PagesService } from './services/pages.service';
import { ProcessHttpmsgService } from './services/process-httpmsg.service';
import { TraverseService } from './services/traverse.service';
import { UploadService } from './services/upload.service';
import { baseURL } from './shared/baseurl';
import { RestangularConfigFactory } from './shared/restConfig';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';




@NgModule({
  declarations: [
    AppComponent,
    MainGuiComponent,
    EsriMapComponent,
    DialogByCoordinatesComponent,
    DialogDisplayResultComponent,
    StatusDialogComponent,
    CertVerifyDialogComponent,
    WelcomePageComponent,
    WelcomeDialogComponent,
    MapboxPageComponent,
    UploadDialogComponent,
    BearingDistTableComponent,
    FeatureUploadComponent,
    FeatureLayersDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-larmas-application'),
    AngularFirestoreModule,
    RestangularModule.forRoot(RestangularConfigFactory),
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBottomSheetModule,
    NgxMapboxGLModule.forRoot({
      accessToken: environment.mapbox.accessToken, // Can also be set per map (accessToken input of mgl-map)
      geocoderAccessToken: environment.mapbox.accessToken // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    })
  ],
  providers: [
    ProjectionModel,
    PdfReporter,
    ImageDataFile,
    FirestoreService,
    MongodbService,
    EsriMapService,
    { provide: 'BaseURL', useValue: baseURL },
    PagesService,
    ProcessHttpmsgService,
    MapboxGlService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    UploadService,
    TraverseService
  ],
  entryComponents: [
    DialogByCoordinatesComponent,
    DialogDisplayResultComponent,
    StatusDialogComponent,
    CertVerifyDialogComponent,
    WelcomeDialogComponent,
    UploadDialogComponent,
    FeatureUploadComponent,
    FeatureLayersDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
