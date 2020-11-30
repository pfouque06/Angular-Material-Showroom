import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, flatMap, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { State } from '../../store/states';
import { selectUserToken } from '../../store/user/user.selector';

@Injectable()
export class JwtHttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private store: Store<State>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('JwtHttpInterceptorInterceptor.intercept()');
    return this.store.pipe(
      select(selectUserToken),
      first(),
      flatMap( token => {
        if (! token) { return next.handle(request); }
        // console.log('intercept(): token= ' + token);
        const updatedRequest = request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
        return next.handle(updatedRequest);
      })
    );
    // return next.handle(updatedRequest);
  }

}
