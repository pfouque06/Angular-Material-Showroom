import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, map, skip, take } from 'rxjs/operators';
import { User } from '../models/class/user';
import { State } from '../store/states';
import { ChangePassword, Login, Logout, Myself, Register, Reset } from '../store/user/user.action';
import { selectUser, selectUserProfile, selectUserState, selectUserToken } from '../store/user/user.selector';
import { ApiHelperService } from './api-helper.service';

@Injectable({ providedIn: 'root' })
export class AuthService {


  public user$: Observable<Partial<User>>;
  private _isLogged = false;
  private previousLoggedState = false;

  // KeepAlive observable
  private _pong = false;
  private heartBeatService: Observable<number>;
  private keepAliveService: Subscription;

  private titleCasePipe = new TitleCasePipe();
  constructor( private api: ApiHelperService, private store: Store<State>, private router: Router ) {
    // define user from store
    this.user$ = this.store.pipe(select(selectUser), take(1));

    // check logging state by reload user with a delay in order to wait @ngrx/init
    setTimeout(() => { this.myself(); }, 500);

    // heartBeat & keepAlive Service
    this.heartBeatService = timer(1000, 10000); // or interval(10000)
    this.keepAliveService = this.heartBeatService.subscribe(
      async () => {
        this._pong = await this.ping();
        if (this._pong && this.isLogged ) {
          this.myself(); // check logging state by reload user
        }
      }
    );
  }

  public async ping(): Promise<boolean> {
    const ping: boolean = await this.api.get({ endpoint: '/ping' }).toPromise()
    .then( (pong) => !!pong )
    .catch( (_) => false );
    return ping;
  }

  public get pong(): boolean { return this._pong; }

  public register$(email: string, password: string) {
    return this.api.post({ endpoint: '/register', data: { email, password } });
  }

  public register(email: string, password: string) {
    this.store.dispatch(new Register({email, password}));
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
    });
  }

  public login$(email: string, password: string) {
    return this.api.post({ endpoint: '/login', data: { email, password } });
  }

  public login(email: string, password: string) {
    this.store.dispatch(new Login({email, password}));
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if ( !!state.errors && state.errors.error ) {
        const errors = state.errors.error;
        // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
        console.log(errors);
      } else if (state.user) { this._isLogged = !!state.user.id; }
    });
  }

  public myself$() { return this.api.get({ endpoint: '/myself' }); }

  public myself() {
    this.store.dispatch(new Myself());
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if (state.errors) {
        this._isLogged = false;
        if ( this._isLogged !== this.previousLoggedState) {
          console.log('user is timed out ...');
          // if logout reroute page but to /dashboard
          if ( this.router.url.match('^\/dashboard')) { this.router.navigate(['/home']); }
        }
      } else if (state.user) {
        this._isLogged = !!state.user.id;
        // if ( this._isLogged ) { console.log('user is still logged in'); }
        if ( this._isLogged !== this.previousLoggedState) { this.previousLoggedState = this._isLogged; }
      }
    });
  }

  public logout$() { return this.api.post({ endpoint: '/logout' }); }

  public logout() {
    this.store.dispatch(new Logout());
    this.store.pipe( select(selectUserState), skip(1), take(1))
    .subscribe( (state) => {
      if ( !!state.errors && state.errors.error ) {
        const errors = state.errors.error;
        // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
        console.log(errors);
      } else { this._isLogged = false; }
    });
  }

  public mailCheck$(mail: string) {
    return this.api.get({ endpoint: '/mailCheck/' + mail });
  }

  public changePassword$(password: string, newPassword: string) {
    return this.api.put({ endpoint: '/changePassword', data: { password, newPassword } });
  }

  public changePassword(password: string, newPassword: string) {
    this.store.dispatch(new ChangePassword({password, newPassword}));
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
    });
  }

  public reset$() { return this.api.post({ endpoint: '/reset' }); }

  public reset() {
    this.store.dispatch(new Reset());
    this.store.pipe( select(selectUserState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
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
    let result = '';
    if (user) {
      result = user.email; // default value
      if (user && ( (user.firstName !== 'none') || ( user.lastName !== 'none') ) ) {
        result = user.firstName + ' ' + user.lastName;
        result = this.titleCasePipe.transform(result);
      }
    }
    return result;
  }
}
