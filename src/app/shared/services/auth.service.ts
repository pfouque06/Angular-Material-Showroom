import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, map, skip, switchMap, take, tap } from 'rxjs/operators';
import { User } from '../models/class/user';
import { State } from '../store/states';
import { Login, Register } from '../store/user/user.action';
import { selectUser, selectUserState, selectUserToken } from '../store/user/user.selector';
import { ApiHelperService } from './api-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private titleCasePipe=new TitleCasePipe();

  // KeepAlive observable
  private _pong: boolean = false;
  private heartBeatService: Observable<number>;
  private keepAliveService: Subscription;

  // private _user: User = new User({ id: -1 });
  private _user: User = undefined;
  public user$: Observable<Partial<User>>;

  private subscriptions: Subscription[] = null;


  constructor( private api: ApiHelperService, private store: Store<State> ) {
    // define user from store
    this.user$ = this.store.pipe(select(selectUser), take(1));

    // heartBeat Service
    this.heartBeatService = timer(1000, 10000); // or interval(10000)

    // keepAliveService
    this.keepAliveService = this.heartBeatService.subscribe(
      async () => {
        this._pong = await this.ping();
        if (this._pong) {
            if (this.isLogged()) {
              this._user = await this.myself();
              if ( this.isLogged() ) { console.log(`user is still logged in`) }
              else { console.log(`user is loggef off`) }
              // this.myself()
              // .then((resp) => { this._user = resp; })
              // .catch((error) => { this._user = undefined; });
            }
        }
      }
    )
    // pingService init
    // this.pingService = timer(1000, 10000) // or interval(10000)
    // .pipe( switchMap((value) => this.ping().then((pong) => pong).catch((error) => error)));
    // pingListener init
    // this.pingListener = this.pingService.subscribe( (pong) => { this._pong = pong;}, (error) => { this._pong = false;}, );
  }

  public async ping() : Promise<boolean> {
    let ping: boolean = await this.api.get({ endpoint: "/ping" }).toPromise()
      .then( (pong) => !!pong )
      .catch( (_) => false );
    console.log('ping(): ', ping);
    return ping;
  }

  public async myself() : Promise<User> {
    const myself: any = await this.api.get({ endpoint: "/myself" }).toPromise()
    .then( (user) => user )
    .catch( (_) => undefined );
    console.log('myself(): ', myself);
    return myself;
  }

  public async register(email: string, password: string) {
    console.log('AuthService.register(mail: ' + email + ', password: ' + password);
    // return await this.api.post({ endpoint: '/register', data: { email: email, password: password } });
    this.store.dispatch(new Register({email: email, password: password}));
    this.store.pipe(
      select(selectUserState),
      skip(1), take(1), tap( (s) => console.log('AuthService.register().selectUserState: ', s)),
      filter( (s) => !!s.errors && s.errors.error),
      map( (s) => s.errors.error)
    ).subscribe(
      (errors) => { for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }; }
    )
  }

  public async login(email: string, password: string) {
    this._user = undefined;
    console.log('login(mail: ' + email + ', password: ' + password);
    this.store.dispatch(new Login({email: email, password: password}));
    this.store.pipe(
      select(selectUserState),
      skip(1), take(1), tap( (s) => console.log('AuthService.login().selectUserState: ', s)),
    ).subscribe(
      (state) => {
        if ( !!state.errors && state.errors.error) {
          const errors = state.errors.error
          for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
        } else {
          const user = state.user;
          console.log('user is logged: ', user.email);
        }
      }
    )
  }

  public async logout(): Promise<boolean> {
    console.log('logout(currentUser: ' + this._user.email + ')');
    // const result: boolean = await this.api.post({ endpoint: '/logout' });
    // if (result) {
    //   console.log('logout: ' + result);
    //   this._user = undefined;
    // }
    // return result ;
    return null;
  }

  public async test() : Promise<any> {
    // const result: any = await this.api.get({ endpoint: "/test" });
    // console.log('test(): ' + result);
    // return result;
    return null;
  }

  public async changePassword(password: string, newPassword: string): Promise<boolean> {
    console.log(`AuthService.changePassword(password: ${password}, newPassword: ${newPassword})`);
    // return await this.api.put({ endpoint: "/changePassword", data: { password: password, newPassword: newPassword } });
    return null;
  }

  public async reset(): Promise<boolean> {
    // const result: boolean =(await this.api.post({ endpoint: '/reset' }));
    // if (result) {
    //   console.log('reset: ' + result);
    //   this._user = undefined;
    // }
    // return result ;
    return null;
  }

  public async isLogged(): Promise<boolean> {
    const user = await this.user$.toPromise();
    return (!!user);
  }

  public async getCurrentUser(): Promise<Partial<User>> {  return await this.user$.toPromise(); }

  public async getCurrentJWT(): Promise<string> {
    const token = await this.store.pipe(select(selectUserToken), take(1)).toPromise();
    return token;
  }

  public async getCurrentUserFullName() : Promise<string> {
    let result: string = "";
    const user = await this.getCurrentUser();
    if (user) {
      result = user.email; // default value
      if (user && ( (user.firstName != "none") || ( user.lastName != "none") ) ) {
        result = user.firstName + ' ' + user.lastName;
        result = this.titleCasePipe.transform(result);
      }
    }
    return result;
  }


  // public set pong(pong: boolean) { this._pong = pong; }
	public get pong(): boolean { return this._pong; }
}
