import { Directive, ElementRef, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {
  @Input() isActive: boolean = false;

  constructor(private el: ElementRef, @Optional() @Self() private ngControl: NgControl) { }


  @HostListener('input', ['$event']) onInputChange(event: Event) {
    if (!this.isActive) {
      return;
    }

    const input = this.el.nativeElement;
    const value = input.value;

    let sanitizedValue = value.replace(/[^\d]/g, '');

    if (sanitizedValue.charAt(0) === '0') {
      sanitizedValue = sanitizedValue.slice(1);
    }

    input.value = sanitizedValue;

    // Notify Angular form control about the value change
    if (this.ngControl) {
      this.ngControl.control?.setValue(sanitizedValue, { emitEvent: false });
      this.ngControl.control?.updateValueAndValidity();
    }
  }
}
