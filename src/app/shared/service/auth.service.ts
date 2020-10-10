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

  public async register(email: string, password: string): Promise<User> {
    console.log('register(mail: ' + email + ', password: ' + password);
    return await this.api.post({ endpoint: '/register', data: { email: email, password: password } });
  }

  public async login(email: string, password: string): Promise<User> {
    this._user = undefined;
    console.log('login(mail: ' + email + ', password: ' + password);
    const user = await this.api.post({ endpoint: '/login', data: { email: email, password: password } });
    if (user) {
      console.log(user.accessToken);
      this._user = user;
      return user;
    }
    else return undefined;
  }

  public async logout(): Promise<User> {
    console.log('logout(currentUser: ' + this._user.email + ')');
    const user = await this.api.post({ endpoint: '/logout' });
    if (user) {
      console.log('token: ' + user.accessToken);
      this._user = undefined;
      return user;
    }
    else return undefined;
  }

  public async test() : Promise<string> {
    const result = await this.api.get({ endpoint: "/test" });
    console.log('test(): ' + result as string);
    return result as string;
  }

  public async whoami() : Promise<User> {
    return await this.api.get({ endpoint: "/whoami" });
  }

  public getCurrentJWT(): string {
    if (this._user) {
      return this._user.accessToken;
    } else {
      return null
    }
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
