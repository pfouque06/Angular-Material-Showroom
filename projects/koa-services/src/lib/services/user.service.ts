import { Injectable } from '@angular/core';
// import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { filter, map, skip, take } from 'rxjs/operators';
// import { GlobalAlertComponent } from '../components/snackbars/global-alert.component';
import { User } from '../models/class/user';
import { State } from '../store/states';
import { Create, DeleteById, GetAll, GetById, Reset, UpdateById } from '../store/users/users.action';
import { selectUserSetState } from '../store/users/users.selector';
import { ApiHelperService } from './api-helper.service';

const ROOT_ENDPOINT: string = '/users/';

@Injectable({
  providedIn: 'root'
})
// export class UserService extends SearchService<User> {
export class UserService {

  // public authSnackBar: MatSnackBarRef<any>;
  // constructor( protected api: ApiHelperService, private store: Store<State>, private snackBarService: MatSnackBar) {

  constructor( protected api: ApiHelperService, private store: Store<State>) {
  }

  // public getBySearch(keyword: string, page: number, size: number, sortOrder: string, field: string): Promise<User> {
  //   return super._getBySearch("users", keyword, page, size, sortOrder, field);
  // }

  // fireSnackBar(message: string, style: string ) {
  //   this.authSnackBar =  this.snackBarService.openFromComponent(GlobalAlertComponent, {
  //     duration: 2000, // 2 secondds
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top',
  //     panelClass: [style], // style
  //     data : message // provided message
  //   });
  // }

  public getAll$() {
    return this.api.get({ endpoint: ROOT_ENDPOINT });
  }

  public getAllUser() {
    // console.log('UserService.getAllUser()');
    this.store.dispatch(new GetAll());
    this.store.pipe( select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('[getAllUsers] Operation has failed! Please check logs and retry', 'snack-bar-error' );
    });
  }

  public getById$(id: number) {
    return this.api.get({ endpoint: ROOT_ENDPOINT + id });
  }

  public getById(id: number) {
    // const user = await this.api.get({ endpoint: ROOT_ENDPOINT + id }).toPromise();
    this.store.dispatch(new GetById( {id} ));
    this.store.pipe( select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('[GetById] Operation has failed! Please check logs and retry', 'snack-bar-error' );
    });
  }

  public create$(user: User) {
    return this.api.post({ endpoint: ROOT_ENDPOINT, data: user });
  }

  public create(user: User) {
    // console.log('UserService.create()');
    this.store.dispatch(new Create( [{...user}] ));
    this.store.pipe( select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('[Create] Operation has failed! Please check logs and retry', 'snack-bar-error' );
    });
  }

  public updateById$(id: number, user: User) {
    return this.api.put({ endpoint: ROOT_ENDPOINT + id, data: user });
  }

  public updateById(id: number, user: User) {
    // console.log(`UserService.updateByUser(id: ${id})`);
    this.store.dispatch(new UpdateById( { id: id, users: [{...user}]} ));
    this.store.pipe( select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('[UpdateById] Operation has failed! Please check logs and retry', 'snack-bar-error' );
    });
  }

  public deleteById$(id: number) {
    return this.api.delete({ endpoint: ROOT_ENDPOINT + id });
  }

  public deleteById(id: number) {
    // console.log(`UserService.updateByUser(id: ${id})`);
    this.store.dispatch(new DeleteById( {id} ));
    this.store.pipe( select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('[DeleteById] Operation has failed! Please check logs and retry', 'snack-bar-error' );
    });
  }

  public reset$() {
    return this.api.post({ endpoint: ROOT_ENDPOINT + 'reset' });
  }

  public reset() {
    // console.log('UserService.reset()');
    this.store.dispatch(new Reset());
    this.store.pipe( select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
      // this.fireSnackBar('[Reset] Operation has failed! Please check logs and retry', 'snack-bar-error' );
    });
  }
}
