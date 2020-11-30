import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, map, skip, take } from 'rxjs/operators';
import { User } from '../models/class/user';
import { State } from '../store/states';
import { changePassword, Login, Logout, Myself, Register, Reset } from '../store/user/user.action';
import { selectUser, selectUserProfile, selectUserState, selectUserToken } from '../store/user/user.selector';
import { ApiHelperService } from './api-helper.service';

@Injectable({ providedIn: 'root' })
export class AuthService {


  public user$: Observable<Partial<User>>;
  private _isLogged: boolean = false;
  private previousloggedState = false;

  // KeepAlive observable
  private _pong: boolean = false;
  private heartBeatService: Observable<number>;
  private keepAliveService: Subscription;

  private titleCasePipe=new TitleCasePipe();
  constructor( private api: ApiHelperService, private store: Store<State>, private router: Router ) {
    // define user from store
    this.user$ = this.store.pipe(select(selectUser), take(1));

    // check logging state by reload user with a delay in order to wait @ngrx/init
    setTimeout(()=>{ this.myself(); }, 500)

    // heartBeat & keepAlive Service
    this.heartBeatService = timer(1000, 10000); // or interval(10000)
    this.keepAliveService = this.heartBeatService.subscribe(
      async () => {
        this._pong = await this.ping();
        if (this._pong && this.isLogged ) {
          this.myself(); // check logging state by reload user
        }
      }
    )
  }

  public async ping() : Promise<boolean> {
    // console.log('AuthService.ping()');
    let ping: boolean = await this.api.get({ endpoint: "/ping" }).toPromise()
    .then( (pong) => !!pong )
    .catch( (_) => false );
    // console.log('ping() ...', ping ? 'OK' : 'Failed');
    return ping;
  }

	public get pong(): boolean { return this._pong; }

  public register$(email: string, password: string) {
    return this.api.post({ endpoint: '/register', data: { email: email, password: password } });
  }

  public register(email: string, password: string) {
    // console.log('AuthService.register(mail: ' + email + ', password: ' + password);
    this.store.dispatch(new Register({email: email, password: password}));
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('Register has failed! Please check credentials and retry', 'snack-bar-error' );
    });
  }

  public login$(email: string, password: string) {
    return this.api.post({ endpoint: '/login', data: { email: email, password: password } });
  }

  public login(email: string, password: string) {
    // console.log('login(mail: ' + email + ', password: ' + password);
    this.store.dispatch(new Login({email: email, password: password}));
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if ( !!state.errors && state.errors.error ) {
        const errors = state.errors.error;
        for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
        // this.fireSnackBar('Login has failed! Please check your credentials', 'snack-bar-error' );
      } else if (state.user) { this._isLogged = !!state.user.id; }
    });
  }

  public myself$() { return this.api.get({ endpoint: "/myself" }); }

  public myself() {
    // const myself: any = await this.api.get({ endpoint: "/myself" }).toPromise()
    this.store.dispatch(new Myself());
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if (state.errors) {
        this._isLogged = false;
        if ( this._isLogged != this.previousloggedState) {
          console.log('user is timed out ...');
          // this.fireSnackBar('You have been timed out ...', 'snack-bar-info' );
          // if logout reroute page but to /dashboard
          if ( this.router.url.match('^\/dashboard')) { this.router.navigate(['/home']); }
        }
      } else if (state.user) {
        this._isLogged = !!state.user.id;
        // if ( this._isLogged ) { console.log('user is still logged in'); }
        if ( this._isLogged != this.previousloggedState) { this.previousloggedState = this._isLogged; }
      }
    });
  }

  public logout$() { return this.api.post({ endpoint: "/logout" }); }

  public logout() {
    // console.log('AuthService.logout()');
    this.store.dispatch(new Logout());
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if ( !!state.errors && state.errors.error ) {
        const errors = state.errors.error;
        for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
        // this.fireSnackBar('Logout has failed! please check logs', 'snack-bar-error' );
      } else { this._isLogged = false; }
    });
  }

  public changePassword$(password: string, newPassword: string) {
    return this.api.put({ endpoint: '/changePassword', data: { password: password, newPassword: newPassword } });
  }

  public changePassword(password: string, newPassword: string) {
    // console.log(`AuthService.changePassword(password: ${password}, newPassword: ${newPassword})`);
    this.store.dispatch(new changePassword({password: password, newPassword: newPassword}));
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('Password change has failed! Please check api.koa logs', 'snack-bar-error' );
    });
  }

  public reset$() { return this.api.post({ endpoint: '/reset' }); }

  public reset() {
    // console.log('AuthService.reset()');
    this.store.dispatch(new Reset());
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('Reset has failed! Please check api.koa logs', 'snack-bar-error' );
    });
  }

  public get isLogged(): boolean { return this._isLogged; }

  public async getCurrentUser(): Promise<Partial<User>> {  return await this.user$.toPromise(); }

  public getCurrentJWT$(): Observable<string> {
    return this.store.pipe(select(selectUserToken));
  }

  public getCurrentUserProfileType$(): Observable<string> {
    return this.store.pipe( select(selectUserProfile));
  }

  public getCurrentUserFullName$(): Observable<string> {
    return this.store.pipe( select(selectUser), map( (user) => this.getUserFullName(user) ));
  }

  private getUserFullName(user: Partial<User>): string {
    let result: string = "";
    if (user) {
      result = user.email; // default value
      if (user && ( (user.firstName != "none") || ( user.lastName != "none") ) ) {
        result = user.firstName + ' ' + user.lastName;
        result = this.titleCasePipe.transform(result);
      }
    }
    return result;
  }
}
