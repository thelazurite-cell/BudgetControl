import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {LoginService} from './login.service';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.headers.keys().filter(itm => itm.toLowerCase() === 'access-control-allow-headers').length === 0) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.loginService.authToken}`
        }
      });
    }
    return next.handle(req);
  }
}
