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

    // Remueve cualquier caracter que no sea un número
    input.value = value.replace(/[^\d]/g, '');

    // Verifica si hay ceros a la izquierda y los elimina
    if (input.value.charAt(0) === '0') {
      input.value = input.value.slice(1);
    }
  }
}
