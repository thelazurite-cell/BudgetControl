import {Injectable} from '@angular/core';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenav: MatDrawer;

  public setSidenav(sidenav: MatDrawer) {
    this.sidenav = sidenav;
  }

  public open() {
    return this.sidenav.open();
  }

  public close() {
    if(this.sidenav)
    return this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }
}
