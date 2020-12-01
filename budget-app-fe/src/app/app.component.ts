import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {LoginService} from './services/login.service';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {SidenavService} from './navigation-bar/sidenav.service';
import {DataTransferService} from './services/data-transfer.service';
import {Category} from './classes/dto/category';
import {DialogService} from './services/dialog.service';
import {DialogModel} from './dialog/dialog/dialog-model';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'budget-app-fe';
  public env = environment;

  @ViewChild('drawer') public sidenav: MatDrawer;
  @ViewChild('dialogPh', {read: ViewContainerRef})
  protected dialogPlaceholder: ViewContainerRef;

  constructor(private sidenavService: SidenavService, private dataTransferService: DataTransferService, private dialogService: DialogService) {
    this.sidenavService.setSidenav(this.sidenav);
    console.log(this.sidenav);
  }

  async ngAfterViewInit(): Promise<void> {
    this.sidenavService.setSidenav(this.sidenav);
    console.log("VIEW");
    console.log(this.dialogPlaceholder);
    this.dialogService.setView(this.dialogPlaceholder);

    return Promise.resolve();
  }
}
