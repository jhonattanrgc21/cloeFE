import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appLettersOnly]'
})
export class LettersOnlyDirective {
  @Input() isActive: boolean = false;
  private regex: RegExp = /^[a-zA-ZÀ-ÖØ-öø-ÿÑñÄäËëÏïÖöÜüŸÿ\s]*$/;

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    if (!this.isActive) {
      return;
    }

    const input = this.el.nativeElement;
    const value = input.value;

    if (!this.regex.test(value)) {
      input.value = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿÑñÄäËëÏïÖöÜüŸÿ\s]/g, '');
      event.preventDefault();
    }
  }
}
