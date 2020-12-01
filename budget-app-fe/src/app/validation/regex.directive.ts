import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appRegex]'
})
export class RegexDirective {

  constructor(private el: ElementRef) {
  }

  @Input('appRegex') regexValue: string;

  private get regex() {
    return new RegExp(this.regexValue);
  }

  @HostListener('keypress', ['$event']) onKeyDown(event): void {
    let e = <KeyboardEvent> event;
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode == 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    const ch = String.fromCharCode(e.keyCode);
    if (this.regex.test(ch)) {
       return;
    } else {
      e.preventDefault();
    }

  }

}
