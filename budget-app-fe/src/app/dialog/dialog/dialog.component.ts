import { Component, EventEmitter, Output } from "@angular/core";
import { DialogModel } from "./dialog-model";
import {NgForm} from "@angular/forms";

@Component({
  selector: "dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"]
})
export class DialogComponent {
  @Output()
  selected: EventEmitter<string> = new EventEmitter<string>();

  public model: DialogModel;
  public buttons: string[] = [];

  public selectOption(val: string): void {
    this.selected.emit(val);
  }
  onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }
}
