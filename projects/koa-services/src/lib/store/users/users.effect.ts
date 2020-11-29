import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Set, Fail, GetAll, UsersActionTypes, Clear, Create, GetById, UpdateById, DeleteById } from './users.action';
import { UserService } from '../../services/user.service';

@Injectable()
export class UsersEffects {

  constructor(
    private actions$: Actions,
    private users: UserService
  ) {}

  @Effect()
  public userGetAll$ = this.actions$.pipe(
    ofType(UsersActionTypes.GetAll),
    // tap( _ => console.log('[users] GetAll.effect() .....')),
    switchMap( (action: GetAll) =>
      this.users.getAll$()
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => [ new Set(r.body) ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userGetById$ = this.actions$.pipe(
    ofType(UsersActionTypes.GetById),
    // tap( _ => console.log('[users] GetById.effect() .....')),
    switchMap( (action: GetById) =>
      this.users.getById$( action.payload.id )
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => [ new Set([{...r.body}]) ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public useCreate$ = this.actions$.pipe(
    ofType(UsersActionTypes.Create),
    // tap( _ => console.log('[users] Create.effect() .....')),
    switchMap( (action: Create) =>
      this.users.create$( action.payload[0] )
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( (r) => [ new Set([{...r.body}]) ]),
        catchError( () => of(new Clear()))
      )
    )
  );

  @Effect()
  public userUpdateById$ = this.actions$.pipe(
    ofType(UsersActionTypes.UpdateById),
    // tap( _ => console.log('[users] UpdateById.effect() .....')),
    switchMap( (action: UpdateById) =>
      this.users.updateById$(action.payload.id, action.payload.users[0])
        .pipe(
          mergeMap( (r) => [ new Set([{...r.body}]) ] ),
          catchError( (e) => of(new Fail(e)))
        )
    )
  );

  @Effect()
  public userDeleteById$ = this.actions$.pipe(
    ofType(UsersActionTypes.DeleteById),
    // tap( _ => console.log('[users] DeleteById.effect() .....')),
    switchMap( (action: DeleteById ) =>
      this.users.deleteById$( action.payload.id )
      .pipe(
        mergeMap( (r) => [ new Clear() ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );

  @Effect()
  public userReset$ = this.actions$.pipe(
    ofType(UsersActionTypes.Reset),
    // tap( _ => console.log('[users] Reset.effect() .....')),
    switchMap( () =>
      this.users.reset$()
      .pipe(
        // tap ( (r) => console.log('result: ', r)),
        mergeMap( () => [ new Clear() ]),
        catchError( (e) => of(new Fail(e)))
      )
    )
  );
}
