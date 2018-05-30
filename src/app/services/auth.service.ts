import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';



interface AuthResponse {
  status: string,
  success: string,
  token: string,
  role: string
};

interface JWTResponse {
  status: string,
  success: string,
  user: any
};

@Injectable()
export class AuthService {

 tokenKey: string = 'JWT';
 isAuthenticated: Boolean = false;
 username: Subject<string> = new Subject<string>();
 role: Subject<string> = new Subject<string>();
 authToken: string = undefined;

 private usersRole = new BehaviorSubject<string>('Ordinary User');
 userRole = this.usersRole.asObservable();

  constructor(private http: HttpClient,
    private ProcessHttpmsgService: ProcessHttpmsgService) { 
  }
  
  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + 'users/checkJWTtoken')
    .subscribe(res => {
      // console.log("JWT Token Valid: ", res);
      this.sendUsername(res.user.username);
      // this.sendUserRole(res.user.role);
    },
    err => {
      console.log("JWT Token invalid: ", err);
      this.destroyUserCredentials();
    })
  }
 
  sendUsername(name: string) {
    this.username.next(name);
  }


  clearUsername() {
    this.username.next(undefined);
    this.role.next(undefined);
  }

  loadUserCredentials() {
    var credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    // console.log("loadUserCredentials ", credentials);
    if (credentials && credentials.username != undefined) {
      this.useCredentials(credentials);
      if (this.authToken)
        this.checkJWTtoken();
    }
  }

  storeUserCredentials(credentials: any) {
    // console.log("storeUserCredentials ", credentials);    
    localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.sendUsername(credentials.username);
    // this.sendUserRole(credentials.role);
    this.authToken = credentials.token;
    this.usersRole.next(credentials.role) ;
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  signUp() {

  }

  logIn(user: any): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + 'users/login', 
      {"username": user.username, "password": user.password})
      .map(res => {
        // console.log(res);        
          this.storeUserCredentials({username: user.username, token: res.token, role: res.role});
          return {'success': true, 'username': user.username };
      })
        .catch(error => { return this.ProcessHttpmsgService.handleError(error); });
  }

  logOut() {
    this.destroyUserCredentials();
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  // getUserRole(): Observable<string> {
  //   return this.role.asObservable();
  // }

  getToken(): string {
    return this.authToken;
  }

  getUserRole(): string {
    return this.usersRole.getValue();
  }
}
