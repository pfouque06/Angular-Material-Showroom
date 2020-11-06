import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { UserActionTypes, Set, Fail, Login, Update, Register, Delete, Clear } from './user.action';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
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
    switchMap( (action: Register) =>
      this.api.post({ endpoint: '/register', data: { email: action.payload.email, password: action.payload.password } })
      .then((r) => new Set({user: r.body.data}))
      .catch((e) => of(new Fail(e)))
    )
  )

  // @Effect()
  // public userLogin$ = this.actions$.pipe(
  //   ofType(UserActionTypes.Login),
  //   switchMap( (action: Login) =>
  //     this.backend.login(action)
  //       .pipe(
  //         mergeMap( (r) => [
  //           new Set({user: r.body.data.user, token: r.body.data.token}),
  //           new SessionSet(r.body.data.sessions)
  //         ]),
  //         catchError( (e) => of(new Fail(e)))
  //       )
  //   )
  // );

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
