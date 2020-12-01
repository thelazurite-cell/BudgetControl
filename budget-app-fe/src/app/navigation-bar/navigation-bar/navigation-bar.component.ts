import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {SidenavService} from '../sidenav.service';
import {Router} from '@angular/router';
import {DataTransferService} from '../../services/data-transfer.service';
import {QueryGroup} from '../../classes/dto/filtering/query-group';
import {FilterTypeEnum} from '../../classes/dto/filtering/filter-type.enum';
import {Query} from '../../classes/dto/filtering/query';
import {User} from '../../classes/dto/interfaces/data-transfer-object.interface';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  public isAuthenticated = false;
  public userDisplayName: string = '';

  constructor(private loginService: LoginService, private dataService: DataTransferService, private sideNavService: SidenavService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    await this.loginService.isAuthenticated.subscribe(async (value) => {
      this.isAuthenticated = value;
      if (!this.isAuthenticated) {
        this.router.navigate(['login']).then(() => console.log(''));
        await this.sideNavService.close();
      } else {
        let qg = new QueryGroup();
        qg.comparisonType = FilterTypeEnum.byId;
        let q = new Query();
        let text = atob(this.loginService.authToken);
        let parse: any = JSON.parse(text);
        q.fieldValue = parse.userId;
        qg.queries.push(q);
        this.dataService.js.subscribe(subscription => {
          if(subscription.name == "find" && subscription.type == 'user'){
            var user = new User();
            Object.assign(user, subscription.value.pop());
            this.userDisplayName = `${user.firstName} ${user.lastName}`;
          }
        });
        await this.dataService.findItems<User>('user', qg).then((id) => {
          console.log(id);
        });
      }
    });
  }
// i swear to god javascript is trash
  toggleRightSidenav() {//
    this.sideNavService.toggle();
  }

  public logout() {
    this.loginService.logout();
  }
}
