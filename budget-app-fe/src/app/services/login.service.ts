import {EventEmitter, Injectable} from '@angular/core';
import {AuthenticationStatus} from '../classes/authentication-status';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public authToken;

  public get authenticated() {
    return this.isAuthenticated.getValue();
  }

  public set authenticated(value: boolean) {
    this.isAuthenticated.next(value);
  }

  private events: EventEmitter<AuthenticationStatus> = new EventEmitter();

  constructor(private http: HttpClient) {
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus() {
    const token = LoginService.readTokenCookie();
    if(token && token.length > 0) {
      const value: any = JSON.parse(atob(token));
      const currentDate = new Date();
      const expires = new Date(value.accessTokenExpiresAt);
      if (currentDate > expires) {
        this.logout();
      } else {
        this.authToken = token;
        this.authenticated = true;
        this.emitAuthenticationStatus(true);
      }
    }
  }

  private static readTokenCookie() {
    const name = 'token=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return  c.substring(name.length, c.length);
      }
    }
    return '';
  }

  public async authenticate(username, password): Promise<void> {
    const requestBody = {attempt: btoa(`${username}:${password}`)};
    await this.http.post(`${environment.backendHost}auth/login`, requestBody).subscribe((obj: any) => {
      const errors = [];
      console.log(obj);
      this.authenticated = obj.success;
      if (!obj.success) {
        errors.push(obj.reason);
        this.emitAuthenticationStatus(obj.success, errors);
      } else {
        this.authToken = `${obj.result}`;
        const decoded: any = JSON.parse(atob(this.authToken));
        const expires =  moment(decoded.accessTokenExpiresAt);
        document.cookie = 'token=' + this.authToken + ';' + new Date(expires.utc().date()).toUTCString() + ';path=/;';
        this.checkAuthenticationStatus();
      }
      return;
    }, (err) => {
      this.authenticated = false;
      this.emitAuthenticationStatus(false, [err]);
    });
  }

  public logout() {
    const date = new Date();
    date.setTime(date.getTime() + (-10 * 24 * 60 * 60 * 1000));
    document.cookie = `token=; expires=${date.toUTCString()}; path=/;`;
    this.authenticated = false;
    this.emitAuthenticationStatus(false);
  }

  private emitAuthenticationStatus(success: boolean, errors: Array<string> = []): void {
    this.events.emit(
      new AuthenticationStatus(
        this,
        success,
        errors
      )
    );
  }

  public subscribe(onNext: (value: any) => void, onThrow?: (exception: any) => void, onReturn?: () => void) {
    return this.events.subscribe(onNext, onThrow, onReturn);
  }
}
