import {AbstractControl, ValidatorFn} from '@angular/forms';

export function regexValidator(regexValue: string) {
  return (
    control: AbstractControl
  ): Promise<{ [key: string]: boolean } | null> => {
    const valid = new RegExp(regexValue).test(control.value);
    return Promise.resolve(valid ? null : {valid: false});
  };
}
