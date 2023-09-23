import { Service } from "../../util/Service";

export class NavService extends Service {
  static _init = (function () {
    NavService.serviceName = "onToggleNotifications";
    Service.init(NavService);
  })();
}
