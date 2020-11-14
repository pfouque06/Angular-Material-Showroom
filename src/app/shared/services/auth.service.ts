import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, map, skip, switchMap, take, tap } from 'rxjs/operators';
import { GlobalAlertComponent } from '../components/snackbars/global-alert.component';
import { User } from '../models/class/user';
import { State } from '../store/states';
import { changePassword, Clear, Login, Logout, Myself, Register, Reset, Set } from '../store/user/user.action';
import { selectUser, selectUserState, selectUserToken } from '../store/user/user.selector';
import { ApiHelperService } from './api-helper.service';

@Injectable({ providedIn: 'root' })
export class AuthService {


  public user$: Observable<Partial<User>>;
  private _isLogged: boolean = false;

  // KeepAlive observable
  private _pong: boolean = false;
  private heartBeatService: Observable<number>;
  private keepAliveService: Subscription;

  private titleCasePipe=new TitleCasePipe();
  public authSnackBar: MatSnackBarRef<any>;

  constructor( private api: ApiHelperService, private store: Store<State>, private snackBarService: MatSnackBar ) {
    // define user from store
    this.user$ = this.store.pipe(select(selectUser), take(1));

    // heartBeat Service
    this.heartBeatService = timer(1000, 10000); // or interval(10000)

    // keepAliveService
    this.keepAliveService = this.heartBeatService.subscribe(
      async () => {
        this._pong = await this.ping();
        if (this._pong && this.isLogged ) {
          // check logging state by reload user
          this.myself();
          if ( this.isLogged ) { console.log(`user is still logged in`) }
          else { console.log(`user is timed out ...`) }
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

  fireSnackBar(message: string, style: string ) {
    this.authSnackBar =  this.snackBarService.openFromComponent(GlobalAlertComponent, {
      duration: 2000, // 2 secondds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [style], // style
      data : message // provided message
    });
  }

  public register(email: string, password: string) {
    console.log('AuthService.register(mail: ' + email + ', password: ' + password);
    // return await this.api.post({ endpoint: '/register', data: { email: email, password: password } });
    this.store.dispatch(new Register({email: email, password: password}));
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      this.fireSnackBar('Register has failed! Please check credentials and retry', 'snack-bar-error' );
    });
  }

  public login(email: string, password: string) {
    console.log('login(mail: ' + email + ', password: ' + password);
    this.store.dispatch(new Login({email: email, password: password}));
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if ( !!state.errors && state.errors.error ) {
        const errors = state.errors.error;
        for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
        this.fireSnackBar('Login has failed! Please check your credentials', 'snack-bar-error' );
      } else if (state.user) { this._isLogged = !!state.user.id; }
    });
  }

  public myself() {
    // const myself: any = await this.api.get({ endpoint: "/myself" }).toPromise()
    this.store.dispatch(new Myself());
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if (state.errors) { this._isLogged = false;}
      else if (state.user) { this._isLogged = !!state.user.id;}
    });
  }

  public logout() {
    console.log('AuthService.logout()');
    this.store.dispatch(new Logout());
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if ( !!state.errors && state.errors.error ) {
        const errors = state.errors.error;
        for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
        this.fireSnackBar('Logout has failed! please check logs', 'snack-bar-error' );
      } else { this._isLogged = false; }
    });
  }

  public changePassword(password: string, newPassword: string) {
    console.log(`AuthService.changePassword(password: ${password}, newPassword: ${newPassword})`);
    this.store.dispatch(new changePassword({password: password, newPassword: newPassword}));
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      this.fireSnackBar('Password change has failed! Please check api.koa logs', 'snack-bar-error' );
    });
  }

  public reset() {
    console.log('AuthService.reset()');
    this.store.dispatch(new Reset());
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      this.fireSnackBar('Reset has failed! Please check api.koa logs', 'snack-bar-error' );
    });
  }

  public get isLogged(): boolean { return this._isLogged; }

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
}
