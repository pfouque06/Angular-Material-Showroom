import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { UserActionTypes, Set, Fail, Login, Update, Register, Delete, Clear, Ready, changePassword } from './user.action';
import { switchMap, map, catchError, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiHelperService } from '../../services/api-helper.service';

@Injectable()
export class UserEffects {

  constructor(
    private actions$: Actions,
    private api: ApiHelperService,
  ) {}

  @Effect()
  public userRegister$ = this.actions$.pipe(
    ofType(UserActionTypes.Register),
    tap( _ => console.log('effect().Register .....')),
    switchMap( (action: Register) =>
      this.api.post({ endpoint: '/register', data: { email: action.payload.email, password: action.payload.password } })
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        // mergeMap( (r) => [ new Set({user: r.body.data}) ]),
        mergeMap( (r) => [ new Clear() ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  )

  @Effect()
  public userLogin$ = this.actions$.pipe(
    ofType(UserActionTypes.Login),
    tap( _ => console.log('effect().login .....')),
    switchMap( (action: Login) =>
      this.api.post({ endpoint: '/login', data: { email: action.payload.email, password: action.payload.password } })
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => { return [ new Set({user: r.body, token: r.body.accessToken}) ]; }),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userMyself$ = this.actions$.pipe(
    ofType(UserActionTypes.Myself),
    // tap( _ => console.log('effect().myself .....')),
    switchMap( (action: Login) =>
      this.api.get({ endpoint: "/myself" })
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => { return [ new Set({user: r.body, token: r.body.accessToken}) ]; }),
        catchError( (e) => of(new Clear()))
      )
    )
  );

  @Effect()
  public userLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.Logout),
    tap( _ => console.log('effect().logout .....')),
    switchMap( (action: Login) =>
      this.api.post({ endpoint: '/logout' })
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => { return [ new Clear() ]; }),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userchangePassword$ = this.actions$.pipe(
    ofType(UserActionTypes.changePassword),
    tap( _ => console.log('effect().changePassword .....')),
    switchMap( (action: changePassword) =>
      this.api.put({ endpoint: '/changePassword', data: { password: action.payload.password, newPassword: action.payload.newPassword } })
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => { return [ new Ready() ]; }),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userReset$ = this.actions$.pipe(
    ofType(UserActionTypes.Reset),
    tap( _ => console.log('effect().Reset .....')),
    switchMap( (action: Login) =>
      this.api.post({ endpoint: '/reset' })
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => { return [ new Clear() ]; }),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  // @Effect()
  // public userUpdate$ = this.actions$.pipe(
  //   ofType(UserActionTypes.Update),
  //   switchMap( (action: Update) =>
  //     this.backend.changeAccountProfile(action)
  //       .pipe(
  //         mergeMap( (r) => [ new Set({user: r.body.data.user}) ]),
  //         catchError( (e) => of(new Fail(e)))
  //       )
  //   )
  // );

  // @Effect()
  // public userDelete$ = this.actions$.pipe(
  //   ofType(UserActionTypes.Delete),
  //   switchMap( (action: Delete ) =>
  //     this.backend.requestQRCode()
  //     .pipe(
  //       mergeMap( (r) => [ new Clear() ]),
  //       catchError( (e) => of(new Fail(e)))
  //     )
  //   )
  // );
}
