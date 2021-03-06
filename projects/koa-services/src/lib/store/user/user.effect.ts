import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { UserActionTypes, Set, Fail, Login, Register, Clear, Ready, ChangePassword } from './user.action';
import { switchMap, catchError, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private auth: AuthService
  ) {}

  @Effect()
  public userRegister$ = this.actions$.pipe(
    ofType(UserActionTypes.Register),
    // tap( _ => console.log('[user]effect().Register .....')),
    switchMap( (action: Register) =>
      this.auth.register$(action.payload.email, action.payload.password )
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( () => [ new Clear() ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.Login),
    // tap( _ => console.log('[user]effect().login .....')),
    switchMap( (action: Login) =>
      this.auth.login$(action.payload.email, action.payload.password )
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => [ new Set({user: r.body, token: r.body.accessToken}) ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userMyself$ = this.actions$.pipe(
    ofType(UserActionTypes.Myself),
    // tap( _ => console.log('[user]effect().Myself .....')),
    switchMap( () =>
      this.auth.myself$()
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => [ new Set({user: r.body, token: r.body.accessToken}) ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.Logout),
    // tap( _ => console.log('[user]effect().logout .....')),
    switchMap( () =>
      this.auth.logout$()
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( () => [ new Clear() ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userChangePassword$ = this.actions$.pipe(
    ofType(UserActionTypes.ChangePassword),
    // tap( _ => console.log('[user]effect().changePassword .....')),
    switchMap( (action: ChangePassword) =>
      this.auth.changePassword$( action.payload.password, action.payload.newPassword )
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( () => [ new Ready() ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userReset$ = this.actions$.pipe(
    ofType(UserActionTypes.Reset),
    // tap( _ => console.log('[user]effect().Reset .....')),
    switchMap( () =>
      this.auth.reset$()
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( () => [ new Clear() ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );
}
