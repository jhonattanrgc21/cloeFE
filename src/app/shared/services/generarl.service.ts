import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GenerarlService {

  constructor() { }

	noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = /^(?!\s*$).+/i.test(control.value);
      return isValid ? null : { 'required': true };
    };
  }
}
