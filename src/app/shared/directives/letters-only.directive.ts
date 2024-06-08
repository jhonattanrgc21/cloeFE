import { Directive, ElementRef, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLettersOnly]'
})
export class LettersOnlyDirective {
  @Input() isActive: boolean = false;
  private regex: RegExp = /^[a-zA-ZÀ-ÖØ-öø-ÿÑñÄäËëÏïÖöÜüŸÿ\s]*$/;

  constructor(private el: ElementRef, @Optional() @Self() private ngControl: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    if (!this.isActive) {
      return;
    }

    const input = this.el.nativeElement;
    const value = input.value;

    if (!this.regex.test(value)) {
      const sanitizedValue = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿÑñÄäËëÏïÖöÜüŸÿ\s]/g, '');
      input.value = sanitizedValue;

      // Notify Angular form control about the value change
      if (this.ngControl) {
        this.ngControl.control?.setValue(sanitizedValue, { emitEvent: false });
        this.ngControl.control?.updateValueAndValidity();
      }
    } else {
      if (this.ngControl) {
        this.ngControl.control?.setValue(value, { emitEvent: false });
        this.ngControl.control?.updateValueAndValidity();
      }
    }
  }
}
