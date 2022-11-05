import { Service } from "../../util/Service";

export class WorkspaceTabService extends Service {
  static newTabs = [];

  static _init = (function () {
    WorkspaceTabService.serviceName = "onDataUpdate";
    Service.init(WorkspaceTabService);
  })();

  static insertTab(tab) {
    WorkspaceTabService.newTabs.push(tab);
    document.dispatchEvent(WorkspaceTabService.onServiceEvent);
  }
}
