import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  constructor(private http: HttpClient) { }

  // public get({ endpoint, data = {}, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Promise<any> {
  public get({ endpoint, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Promise<any> {
    return this.request({ endpoint, method: 'GET', queryParams });
  }

  public post({ endpoint, data = {}, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Promise<any> {
    // console.log('post/', endpoint, data);
    return this.request({ endpoint, method: 'POST', data, queryParams });
  }

  public put({ endpoint, data = {}, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Promise<any> {
    return this.request({ endpoint, method: 'PUT', data, queryParams });
  }

  public delete({ endpoint, data = {}, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Promise<any> {
    return this.request({ endpoint, method: 'DELETE', data, queryParams });
  }

  public request({ endpoint, method = 'GET', data = {}, queryParams = {} }:
    { endpoint: string; method?: string; data?: object; queryParams?: any; }): Promise<any> {
    const methodWanted = method.toLowerCase();

    const url = environment.base_url + endpoint;

    const requestOptions = {
      params: queryParams
    };

    console.log(method + ' ' + url + ' ' + JSON.stringify(data) + ' ' + JSON.stringify(queryParams));

    let req: Observable<any> = null;
    switch (methodWanted) {
      case 'get': {
        req = this.http.get(url, { ...requestOptions, observe: 'response' });
        break;
      }
      case 'post': {
        req = this.http.post(url, data, { ...requestOptions, observe: 'response' });
        break;
      }
      case 'put': {
        req = this.http.put(url, data, { ...requestOptions, observe: 'response' });
        break;
      }
      case 'delete': {
        req = this.http.delete(url, { ...requestOptions, observe: 'response' });
        break;
      }
    }

    if (!req) {
      throw new Error(`error calling ${url} with method ${methodWanted}`);
    }

    // console.log('response', req);

    return req.toPromise().then((res) => {
      // console.log('body: ', res.body);
      return res.body;
    });
  }
}
