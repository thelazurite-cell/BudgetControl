import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('Username') public username: ElementRef;
  @ViewChild('Password') public password: ElementRef;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  async attemptAuthenticate() {
    let username1 = this.username.nativeElement.value;
    console.log(username1);
    let password1 = this.password.nativeElement.value;
    await this.loginService.Authenticate(username1, password1);
  }
}
