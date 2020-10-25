import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { from, interval, Observable, Subscription, timer } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, scan, switchMap, timeInterval } from 'rxjs/operators';
import { User } from '../models/class/user';
import { ApiHelperService } from './api-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private titleCasePipe=new TitleCasePipe();

  // KeepAlive observable
  private _pong: boolean = false;
  private pingService: Observable<any>;
  private pingListener: Subscription;

  // private _user: User = new User({ id: -1 });
  private _user: User = undefined;
  public currentUserService: Observable<any>;
  private currentUserListener: Subscription;

  constructor(private api: ApiHelperService) {
    // pingService init
    this.pingService = timer(1000, 10000) // or interval(10000)
    .pipe(
      switchMap((value) => this.ping()
      .then((pong) => pong)
      .catch((error) => error)
      )
    );

    // pingListener init
    this.pingListener = this.pingService.subscribe(
      (pong) => { this._pong = pong;},
      (error) => { this._pong = false;},
      // () => { this.setPong(false);},
    );


    // currentUserService init
    this.currentUserService = timer(2000, 10000) // or interval(10000)
      // .pipe(
      //   switchMap((value) => {
      //     // console.log(`currentUserService.logged: `, this.isLogged());
      //     return this.myself()
      //     .then((resp) => resp)
      //     .catch((error) => error);
      //   }));

    // currentUserListener init
    this.currentUserListener = this.currentUserService.subscribe(
      (resp) => {
        // if (resp.headers && ! resp.headers.ok) {
        //   if (resp.error) { this._user = undefined; }
        //   else { this._user = resp; }
        if (this.isLogged()) this.myself()
            .then((resp) => {
              console.log(`user is still logged in`);
              this._user = resp;
            })
            .catch((error) => {
              console.log(`user is loggef off`);
              this._user = undefined;
            });
      },
      (error) => { console.log(`userListener: `, error); this._user = undefined;},
    );
  }

  public async ping() : Promise<boolean> {
    try {
      return await this.api.get({ endpoint: "/ping" });
    } catch (error) { // TODO : can improve error handling ???
      return false;
    }
  }


  public async register(email: string, password: string): Promise<User> {
    console.log('register(mail: ' + email + ', password: ' + password);
    return await this.api.post({ endpoint: '/register', data: { email: email, password: password } });
  }

  public async login(email: string, password: string): Promise<User> {
    this._user = undefined;
    console.log('login(mail: ' + email + ', password: ' + password);
    const user = await this.api.post({ endpoint: '/login', data: { email: email, password: password } });
    if (user) {
      // console.log('--> token: ' + user.accessToken);
      this._user = user;
      // console.log(`--> user: `, this._user);
      return user;
    }
    else return undefined;
  }

  public async logout(): Promise<boolean> {
    console.log('logout(currentUser: ' + this._user.email + ')');
    const result: boolean = await this.api.post({ endpoint: '/logout' });
    if (result) {
      // console.log('logout: ' + result);
      this._user = undefined;
    }
    return result ;
  }

  public async test() : Promise<any> {
    const result: any = await this.api.get({ endpoint: "/test" });
    console.log('test(): ' + result);
    return result;
  }

  public async myself() : Promise<User> {
    const myself: any = await this.api.get({ endpoint: "/myself" });
    // console.log('myself(): ', myself);
    return myself;
  }

  public async changePassword(password: string, newPassword: string): Promise<boolean> {
    console.log(`AuthService.changePassword(password: ${password}, newPassword: ${newPassword})`);
    return await this.api.put({ endpoint: "/changePassword", data: { password: password, newPassword: newPassword } });
  }

  public async reset(): Promise<boolean> {
    const result: boolean =(await this.api.post({ endpoint: '/reset' }));
    if (result) {
      console.log('reset: ' + result);
      this._user = undefined;
    }
    return result ;
  }

  public isLogged(): boolean {
    if (this._user) return true;
    return false;
  }

  public getCurrentJWT(): string {
    if (this._user) return this._user.accessToken;
    return null
  }

  public getCurrentUserFullName() : string {
    let result: string = "";
    if (this._user) {
      result = this._user.email;
      if (this._user && ( (this._user.firstName != "none") || ( this._user.lastName != "none") ) ) {
        result = this._user.firstName + ' ' + this._user.lastName;
        result = this.titleCasePipe.transform(result);
      }
    }
    return result;
  }

  public getCurrentUser(): User {  return this._user; }
  // public set pong(pong: boolean) { this._pong = pong; }
	public get pong(): boolean { return this._pong; }
}
