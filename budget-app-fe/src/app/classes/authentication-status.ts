import {LoginService} from '../services/login.service';

export class AuthenticationStatus {
  public success: boolean;
  public errors: Array<string>;
  public isAuthenticated: boolean;

  constructor(private loginService: LoginService, success: boolean, errors: Array<string> = []) {
    this.success = success;
    this.errors = errors;
    this.isAuthenticated = this.loginService.authenticated;
  }
}
