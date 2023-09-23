import { NavService } from "./NavService";
import { randstring } from "../../api/String.helpers";
import { Service } from "../../util/Service";

export class NotificationService extends Service {
  static items = [];
  static notsCreated = 0;

  static _init = (function () {
    NotificationService.serviceName = "onNotificationUpdate";
    Service.init(NotificationService);
  })();

  static add(notification) {
    this.notsCreated++;
    notification.props.key = randstring();
    this.items.push(notification);

    document.dispatchEvent(NotificationService.onServiceEvent);

    if (notification.openPanel === true) {
      document.dispatchEvent(NavService.onServiceEvent);
    }
  }

  static remove(key) {
    this.notsCreated--;
    console.log(key);
    setTimeout(() => {
      document.dispatchEvent(NotificationService.onServiceEvent);
      document.dispatchEvent(NavService.onServiceEvent);

      for (let i = 0; i < this.items.length; i++) {
        const currKey = this.items[i].key;

        // if there are problems with deleting single notifications uncomment this text to debug
        // console.log(
        //   `this.items[${i}].key (${currKey}) === key (${key}) ?${
        //     currKey === key
        //   } )`
        // );

        if (currKey === key) {
          this.items.splice(i, 1);
          break;
        }
      }

      document.dispatchEvent(NotificationService.onServiceEvent);
      document.dispatchEvent(NavService.onServiceEvent);
    }, 150);
  }

  static clearAll() {
    this.items = [];
    document.dispatchEvent(NotificationService.onServiceEvent);
  }
}
