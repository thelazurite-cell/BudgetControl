import {Directive, OnDestroy} from '@angular/core';
import {LoginService} from '../services/login.service';
import {Router} from '@angular/router';
import {AuthenticationStatus} from '../classes/authentication-status';
import {Location} from '@angular/common';

@Directive({
  selector: '[appProtected]'
})
export class ProtectedDirective implements OnDestroy {
  private readonly sub: any = null;

  constructor(private loginService: LoginService, private router: Router, private location: Location) {
    this.determineAuthStatus(this.loginService.authenticated);
    this.sub = this.loginService.subscribe((emission) => {
      this.determineAuthStatus(emission.isAuthenticated);
    });
  }

  private determineAuthStatus(isAuthenticated: boolean) {
    const logon: string = '/login';
    let currentPath = this.location.path();

    if (!isAuthenticated && currentPath.toLowerCase() !== logon) {
      this.location.replaceState(logon);
      this.router.navigate(['login']).then(() => console.log(''));
    } else if (isAuthenticated && currentPath.toLowerCase() === logon) {
      this.location.replaceState('/');
      this.router.navigate(['']).then(() => console.log(''));
    }
  }

  ngOnDestroy() {
    if (this.sub != null) {
      this.sub.unsubscribe();
    }
  }
}
