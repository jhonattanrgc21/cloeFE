import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumericInput]'
})
export class NumericInputDirective {
  @Input() isActive: boolean = false;
	private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g); // Permite números en el formato "2.33"
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Permite teclas especiales
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Evita la entrada de caracteres especiales, letras, espacios y números negativos
    const isInvalidCharacter = /[^0-9.]/.test(event.key);
    if (isInvalidCharacter || event.key === ' ' || event.key === '-') {
      event.preventDefault();
    }

    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData?.getData('text');

    if (pastedText) {
      // Reemplaza comas con puntos y elimina caracteres no permitidos
      let pastedInput = pastedText.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      if (!pastedInput.match(this.regex) || pastedInput === '.') {
        event.preventDefault();
      } else {
        this.el.nativeElement.value = pastedInput;
        event.preventDefault();
      }
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    let current: string = this.el.nativeElement.value;
    if (current) {
      // Reemplaza comas con puntos y elimina caracteres no permitidos
      let sanitizedValue = current.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      if (!sanitizedValue.match(this.regex) || sanitizedValue === '.') {
        this.el.nativeElement.value = '';
      } else {
        this.el.nativeElement.value = sanitizedValue;
      }
    }
  }
}
