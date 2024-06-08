import { Directive, ElementRef, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumericInput]'
})
export class NumericInputDirective {
  @Input() isActive: boolean = false;
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g); // Permite números en el formato "2.33"
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(private el: ElementRef, @Optional() @Self() private ngControl: NgControl) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isActive) {
      return;
    }

    // Permite teclas especiales
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Evita la entrada de caracteres especiales, letras, espacios y números negativos
    const isInvalidCharacter = /[^0-9.]/.test(event.key);
    if (isInvalidCharacter || event.key === ' ' || (event.key === '-' && this.el.nativeElement.selectionStart !== 0)) {
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
    if (!this.isActive) {
      return;
    }

    let clipboardData = event.clipboardData;
    let pastedText = clipboardData?.getData('text');

    if (pastedText) {
      // Reemplaza comas con puntos y elimina caracteres no permitidos
      let pastedInput = pastedText.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      if (!pastedInput.match(this.regex) || pastedInput === '.') {
        event.preventDefault();
      } else {
        this.el.nativeElement.value = pastedInput;

        // Notify Angular form control about the value change
        if (this.ngControl) {
          this.ngControl.control?.setValue(pastedInput, { emitEvent: false });
          this.ngControl.control?.updateValueAndValidity();
        }

        event.preventDefault();
      }
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    if (!this.isActive) {
      return;
    }

    let current: string = this.el.nativeElement.value;
    if (current) {
      // Reemplaza comas con puntos y elimina caracteres no permitidos
      let sanitizedValue = current.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      if (!sanitizedValue.match(this.regex) || sanitizedValue === '.') {
        this.el.nativeElement.value = '';

        // Notify Angular form control about the value change
        if (this.ngControl) {
          this.ngControl.control?.setValue('', { emitEvent: false });
          this.ngControl.control?.updateValueAndValidity();
        }
      } else {
        this.el.nativeElement.value = sanitizedValue;

        // Notify Angular form control about the value change
        if (this.ngControl) {
          this.ngControl.control?.setValue(sanitizedValue, { emitEvent: false });
          this.ngControl.control?.updateValueAndValidity();
        }
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    if (!this.isActive) {
      return;
    }

    const input = this.el.nativeElement;
    const value = input.value;

    // Eliminar cualquier carácter no numérico, excepto los puntos decimales si no están al final
    input.value = value.replace(/[^0-9.]/g, '');

    // Notificar al control del formulario sobre el cambio de valor
    if (this.ngControl) {
      this.ngControl.control?.setValue(input.value, { emitEvent: false });
      this.ngControl.control?.updateValueAndValidity();
    }
  }

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    if (!this.isActive) {
      return;
    }

    // Formatear el valor del input después de que se completa la entrada
    const input = this.el.nativeElement;
    const value = input.value;

    // Reemplazar "," por "." y formatear el valor a dos decimales
    const formattedValue = parseFloat(value.replace(',', '.')).toFixed(2);
    input.value = formattedValue;

    // Notificar al control del formulario sobre el cambio de valor
    if (this.ngControl) {
      this.ngControl.control?.setValue(formattedValue, { emitEvent: false });
      this.ngControl.control?.updateValueAndValidity();
    }
  }
}
