import { Injectable } from '@angular/core';
import { User } from '../models/class/user';
import { ApiHelperService } from './api-helper.service';

const ROOT_ENDPOINT: string = '/users/';

@Injectable({
  providedIn: 'root'
})
// export class UserService extends SearchService<User> {
export class UserService {

  constructor( protected api: ApiHelperService) {
  }

  // public getBySearch(keyword: string, page: number, size: number, sortOrder: string, field: string): Promise<User> {
  //   return super._getBySearch("users", keyword, page, size, sortOrder, field);
  // }

  public async getAllUser(): Promise<Array<User>> {
    const users = await this.api.get({ endpoint: ROOT_ENDPOINT }).toPromise();
    console.log('users: ', users.body);
    return users.body;
  }

  public async create(user: User): Promise<User> {
    const createdUser = await this.api.post({ endpoint: ROOT_ENDPOINT, data: user }).toPromise();
    console.log('newUser: ', createdUser.body);
    return createdUser.body;
  }

  public async getById(id: number): Promise<User> {
    const user = await this.api.get({ endpoint: ROOT_ENDPOINT + id }).toPromise();
    console.log('user: ', user);
    return user.body;
  }

  public async updateById(id: number, user: User): Promise<User> {
    console.log(`UserService.updateByUser(id: ${id})`);
    console.log("user: ", user);
    const updatedUser =  await this.api.put({ endpoint: ROOT_ENDPOINT + id, data: user }).toPromise();
    console.log("user: ", updatedUser);
    return updatedUser;
  }

  public async deleteById(id: number): Promise<User> {
    const deletedUser =  this.api.delete({ endpoint: ROOT_ENDPOINT + id }).toPromise();
    return deletedUser;
  }

  public async reset(): Promise<boolean> {
    const result = await this.api.post({ endpoint: ROOT_ENDPOINT + 'reset' }).toPromise();
    return result;
  }
}
