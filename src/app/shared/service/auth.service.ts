import { Injectable } from '@angular/core';
import { User } from '../models/class/user';
import { JwtResponse } from '../models/class/jwt-response';
import { ApiHelperService } from './api-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private _user: User = new User({ id: -1 });
  private _user: User = undefined;

  constructor(private api: ApiHelperService) { }

  public async register(email: string, password: string): Promise<User> {
    return await this.api.post({ endpoint: '/register', data: { email: email, password: password } });
  }

  public async login(email: string, password: string): Promise<User> {
    this._user = undefined;
    const user = await this.api.post({ endpoint: '/login', data: { email: email, password: password } });
    console.log(user);
    if (user) {
      this._user = user;
      return user;
    }
    else return undefined;
  }

  public async logout(): Promise<User> {
    const user = await this.api.post({ endpoint: '/logout' });
    if (user) {
      this._user = undefined;
      return user;
    }
    else return undefined;
  }

  public async whoami(token: string) : Promise<User> {
    return await this.api.get({ endpoint: "/whoami", data: token });
  }

  public getCurrentJWT(): string {
    return this.user.accessToken;
  }

  public getCurrentUser(): User {
    return this.user;
  }

  public set user(user: User) {
    this._user = user;
  }

  public get user() : User {
    return this._user;
  }
}
