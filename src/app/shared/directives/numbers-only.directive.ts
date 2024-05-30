import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {
  @Input() isActive: boolean = false;

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement;
    const value = input.value;

    input.value = value.replace(/[^\d]/g, '');

    if (input.value.charAt(0) === '0') {
      input.value = input.value.slice(1);
    }
  }
}
