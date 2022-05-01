export class Service {
  static serviceName = undefined;
  static onServiceEvent = undefined;
  static listeners = [];

  static _init = (function (...args) {})();

  static init = function (object) {
    if (object.serviceName) {
      object.listeners = [];
      object.onServiceEvent = new CustomEvent(object.serviceName, {
        bubbles: false,
        cancelable: true,
        composed: false,
      });
    }
  };

  static createListener(listenerName, callback) {
    if (this.listeners.filter((itm) => itm === listenerName).length === 0) {
      this.listeners.push(listenerName);
      document.addEventListener(this.serviceName, callback);
    }
  }
}
