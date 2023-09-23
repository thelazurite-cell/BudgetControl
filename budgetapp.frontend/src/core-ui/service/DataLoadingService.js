import { Service } from "../../util/Service";

export class DataLoadingService extends Service {
  static _init = (function () {
    DataLoadingService.serviceName = "onForceLoadData";
    Service.init(DataLoadingService);
  })();

  static pushEvent() {
    document.dispatchEvent(DataLoadingService.onServiceEvent);
  }
}
