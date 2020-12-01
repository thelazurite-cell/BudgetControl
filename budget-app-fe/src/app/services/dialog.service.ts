import {
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injectable,
  Output,
  Type,
  ViewContainerRef
} from '@angular/core';
import {DialogComponent} from '../dialog/dialog/dialog.component';
import {DialogModel} from '../dialog/dialog/dialog-model';

@Injectable()
export class DialogService {

  @Output()
  public selection: EventEmitter<string> = new EventEmitter<string>();

  private componentReference: ComponentRef<DialogComponent>;
  private view: ViewContainerRef;

  /**
   * creates an instance of the dialog service.
   * @param componentFactoryResolver - the component factory resolver.
   */
  constructor(protected componentFactoryResolver: ComponentFactoryResolver) {
  }

  /**
   * shows a dialog with the requested model and buttons.
   * @param model - the message and title to display.
   * @param buttons - the options the user can provide.
   * @param view - where the dialog should be injected.
   */
  public showDialog(model: DialogModel, buttons: string[]): void {
    const component = this.resolveDialogBox();
    this.ConfigureDialog(component, model, buttons);
  }

  /**
   * Sets up the dialog before it is displayed to the user.
   * @param component - the dialog box to configure
   * @param model - the model to use
   * @param buttons - the buttons to use
   */
  private ConfigureDialog(component: DialogComponent, model: DialogModel, buttons: string[]) {
    component.model = model;
    component.buttons = buttons;

    // we want to be able to find out what the user selected, so we will subscribe to the listener
    component.selected.subscribe((val: string) => this.selected(val));
  }

  /**
   * resolves the dialog box view by initializing a new instance of the dialog box component dynamically
   * @param view - the view to inject the component into.
   */
  private resolveDialogBox() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    this.componentReference = this.view.createComponent(factory);
    return (this.componentReference.instance as DialogComponent);
  }

  /**
   * gets the value from the component, passed to the service to then return to the relevant interface.
   * @param val - the value the user selected.
   */
  private selected(val: string) {
    this.selection.emit(val);
    this.componentReference.destroy();
  }

  public setView(view: ViewContainerRef) {
    this.view = view;
  }

  /**
   * reset the dialog subscription
   */
  public clear(): void {
    this.selection.unsubscribe();
    this.selection = new EventEmitter<string>();
  }
}
