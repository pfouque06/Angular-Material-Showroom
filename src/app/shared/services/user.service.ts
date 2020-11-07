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

  public async getCurrentUser(): Promise<Partial<User>> {
    return await this.authService.getCurrentUser();
  }

  public async getAllUser(): Promise<Array<User>> {
    // return await this.api.get({ endpoint: ROOT_ENDPOINT })
    return null;
  }

  public async create(user: User): Promise<User> {
    // return await this.api.post({ endpoint: ROOT_ENDPOINT, data: user });
    return null;
  }

  public async getById(id: number): Promise<User> {
    // return await this.api.get({ endpoint: ROOT_ENDPOINT + id })
    return null;
  }

  public async updateById(id: number, user: User): Promise<User> {
    console.log(`UserService.updateByUser(id: ${id})`);
    console.log("user: ", user);
    // return await this.api.put({ endpoint: ROOT_ENDPOINT + id, data: user });
    return null;
  }

  public async deleteById(id: number): Promise<User> {
    // return await this.api.delete({ endpoint: ROOT_ENDPOINT + id });
    return null;
  }

  public async reset(): Promise<boolean> {
    // return await this.api.post({ endpoint: ROOT_ENDPOINT + 'reset' });
    return null;
  }
}
