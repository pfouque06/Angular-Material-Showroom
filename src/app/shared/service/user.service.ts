import { Injectable } from '@angular/core';
import { User } from '../models/class/user';
import { ApiHelperService } from './api-helper.service';
import { AuthService } from './auth.service';

const ROOT_ENDPOINT: string = '/users/';

@Injectable({
  providedIn: 'root'
})
// export class UserService extends SearchService<User> {
export class UserService {

  constructor(
    protected api: ApiHelperService,
    private authService: AuthService) {
  }

  // public getBySearch(keyword: string, page: number, size: number, sortOrder: string, field: string): Promise<User> {
  //   return super._getBySearch("users", keyword, page, size, sortOrder, field);
  // }

  public getCurrentUser(): User {
    return this.authService.getCurrentUser();
  }

  public async getAllUser(): Promise<Array<User>> {
    return await this.api.get({ endpoint: ROOT_ENDPOINT })
  }

  public async create(user: User): Promise<User> {
    return await this.api.put({ endpoint: ROOT_ENDPOINT, data: user });
  }

  public async getById(id: number): Promise<User> {
    return await this.api.get({ endpoint: ROOT_ENDPOINT + id })
  }

  public async updateById(user: User): Promise<User> {
    return await this.api.put({ endpoint: ROOT_ENDPOINT + user.id, data: user });
  }

  public async deleteById(user: User): Promise<User> {
    return await this.api.delete({ endpoint: ROOT_ENDPOINT + user.id });
  }


  public async reset(): Promise<boolean> {
    return await this.api.delete({ endpoint: ROOT_ENDPOINT + 'reset' });
  }
}
