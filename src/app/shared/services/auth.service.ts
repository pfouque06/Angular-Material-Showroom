import { Injectable } from '@angular/core';
import { User } from '../models/class/user';
import { ApiHelperService } from './api-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private _user: User = new User({ id: -1 });
  private _user: User = undefined;

  constructor(private api: ApiHelperService) { }

  public async ping() : Promise<boolean> {
    console.log('ping()');
    const result: boolean = await this.api.get({ endpoint: "/ping" });
    return result;
  }

  public async register(email: string, password: string): Promise<User> {
    console.log('register(mail: ' + email + ', password: ' + password);
    return await this.api.post({ endpoint: '/register', data: { email: email, password: password } });
  }

  public async login(email: string, password: string): Promise<User> {
    this._user = undefined;
    console.log('login(mail: ' + email + ', password: ' + password);
    const user = await this.api.post({ endpoint: '/login', data: { email: email, password: password } });
    if (user) {
      console.log('token: ' + user.accessToken);
      this._user = user;
      return user;
    }
    else return undefined;
  }

  public async logout(): Promise<boolean> {
    console.log('logout(currentUser: ' + this._user.email + ')');
    const result: boolean = await this.api.post({ endpoint: '/logout' });
    if (result) {
      console.log('logout: ' + result);
      this._user = undefined;
    }
    return result ;
  }

  public async test() : Promise<any> {
    const result: any = await this.api.get({ endpoint: "/test" });
    console.log('test(): ' + result);
    return result;
  }

  public async reset(): Promise<boolean> {
    const result: boolean =(await this.api.post({ endpoint: '/reset' }));
    if (result) {
      console.log('reset: ' + result);
      this._user = undefined;
    }
    return result ;
  }

  public async whoami() : Promise<User> {
    return await this.api.get({ endpoint: "/whoami" });
  }

  public isLogged(): boolean {
    if (this._user) return true;
    return false;
  }

  public getCurrentJWT(): string {
    if (this._user) {
      return this._user.accessToken;
    } else {
      return null
    }
  }

  public getCurrentUserFullName() : string {
    let result: string = "none";
    if (this._user && ( (this._user.firstName != "none") || ( this._user.lastName != "none") ) ) {
      result = this._user.firstName + ' ' + this._user.lastName;
    }
    return result;
  }

  public getCurrentUser(): User {
    return this._user;
  }

  public set user(user: User) {
    this._user = user;
  }

  public get user() : User {
    return this._user;
  }
}