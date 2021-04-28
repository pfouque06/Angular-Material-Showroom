import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map, skip, take } from 'rxjs/operators';
import { User } from '../models/class/user';
import { State } from '../store/states';
import { Create, DeleteById, GetAll, GetById, Reset, UpdateById } from '../store/users/users.action';
import { selectUserSetState } from '../store/users/users.selector';
import { ApiHelperService } from './api-helper.service';

const ROOT_ENDPOINT = '/users/';

@Injectable({
  providedIn: 'root'
})
// export class UserService extends SearchService<User> {
export class UserService {

  constructor( protected api: ApiHelperService, private store: Store<State>) {
  }

  // public getBySearch(keyword: string, page: number, size: number, sortOrder: string, field: string): Promise<User> {
  //   return super._getBySearch("users", keyword, page, size, sortOrder, field);
  // }

  public getAll$() {
    return this.api.get({ endpoint: ROOT_ENDPOINT });
  }

  public getAllUser() {
    this.store.dispatch(new GetAll());
    this.store.pipe(select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
    });
  }

  public getById$(id: number) {
    return this.api.get({ endpoint: ROOT_ENDPOINT + id });
  }

  public getById(id: number) {
    this.store.dispatch(new GetById( {id} ));
    this.store.pipe(select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
    });
  }

  public create$(user: User) {
    return this.api.post({ endpoint: ROOT_ENDPOINT, data: user });
  }

  public create(user: User) {
    this.store.dispatch(new Create( [{...user}] ));
    this.store.pipe(select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
    });
  }

  public updateById$(id: number, user: User) {
    return this.api.put({ endpoint: ROOT_ENDPOINT + id, data: user });
  }

  public updateById(id: number, user: User) {
    this.store.dispatch(new UpdateById( { id, users: [{...user}]} ));
    this.store.pipe(select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
    });
  }

  public deleteById$(id: number) {
    return this.api.delete({ endpoint: ROOT_ENDPOINT + id });
  }

  public deleteById(id: number) {
    this.store.dispatch(new DeleteById( {id} ));
    this.store.pipe(select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
    });
  }

  public reset$() {
    return this.api.post({ endpoint: ROOT_ENDPOINT + 'reset' });
  }

  public reset() {
    this.store.dispatch(new Reset());
    this.store.pipe(select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
    .subscribe( (errors) => {
      // for ( const key in errors ) { console.log(`errors[${key}] `, errors[key]); }
      console.log(errors);
    });
  }
}
