export class ModalService {
  static eventsSet = [];

  static resetModalEvents(modalName) {
    const thisModal = ModalService.eventsSet.filter(
      (itm) => itm.name === modalName
    );

    if (thisModal.length > 0) {
      const value = thisModal.pop();
      const index = ModalService.eventsSet.indexOf(value);

      value.set = false;
      ModalService.eventsSet[index] = value;
    }
  }
}
