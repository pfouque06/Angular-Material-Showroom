import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const SERVER_ADDRESS = new InjectionToken<string>('server address');
export const SERVER_PROTOCOL = new InjectionToken<'s' | ''>('server protocol');

const backends = {
  'angular.material.pfouque.fr': { address: 'api.koa.pfouque.fr', protocol: 's'},
  'ionic.demo.pfouque.fr': { address: 'api.koa.pfouque.fr', protocol: 's'},
  localhost: { address: 'localhost:8443', protocol: 's'}
};
export const serverAddress = backends[window.location.hostname].address;
export const serverProtocol = backends[window.location.hostname].protocol;

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  private apiUrl = '';

  constructor(
    private http: HttpClient,
    ) {
    // @Inject(SERVER_ADDRESS) public readonly serverAddress: string,
    // @Inject(SERVER_PROTOCOL) public readonly serverProtocol: 's' | '') {
      // this.apiUrl = `http${this.serverProtocol}://${this.serverAddress}`;
      this.apiUrl = `http${serverProtocol}://${serverAddress}`;
      console.log('############################');
      console.log('api.url: ', this.apiUrl);
      console.log('windows.location: ', window.location);
      console.log('windows.localStorage: ', window.localStorage);
      console.log('############################');
    }

  // public get({ endpoint, data = {}, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Promise<any> {
  public get({ endpoint, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Observable<any> {
    return this.request({ endpoint, method: 'GET', queryParams });
  }

  public post({ endpoint, data = {}, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Observable<any> {
    return this.request({ endpoint, method: 'POST', data, queryParams });
  }

  public put({ endpoint, data = {}, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Observable<any> {
    return this.request({ endpoint, method: 'PUT', data, queryParams });
  }

  public delete({ endpoint, data = {}, queryParams = {} }: { endpoint: string, data?: any, queryParams?: any }): Observable<any> {
    return this.request({ endpoint, method: 'DELETE', data, queryParams });
  }

  public request({ endpoint, method = 'GET', data = {}, queryParams = {} }:
    { endpoint: string; method?: string; data?: object; queryParams?: any; }): Observable<any> {
    const methodWanted = method.toLowerCase();

    // base_url: 'https://localhost:8443'
    // base_url: 'https://api.koa.pfouque.fr:8443'
    // const url = environment.base_url + endpoint;
    const url = `${this.apiUrl}${endpoint}`;

    const requestOptions = {
      params: queryParams
    };

    // console.log(method + ' ' + url + ' ' + JSON.stringify(data) + ' ' + JSON.stringify(queryParams));
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

    return req;
    // return req.toPromise()
    // .then( (res) => { return res.body; })
    // .catch( (res) => { throw res.error; });
  }
}
