import { Directive, ElementRef, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[appSpecialCharactersDirective]',
})
export class SpecialCharactersDirectiveDirective {
	@Input() isActive: boolean = false;
 // Incluye letras, números, acentos, diéresis, caracteres especiales y espacios
 private regex: RegExp = /^[a-zA-Z0-9À-ÖØ-öø-ÿÑñÄäËëÏïÖöÜüŸÿ\s.,:;!?@#$%^&*()_+\-=\[\]{}|\\'"/<>\~`]*$/;
 private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

 constructor(private el: ElementRef, @Optional() @Self() private ngControl: NgControl) { }


 @HostListener('keydown', ['$event'])
 onKeyDown(event: KeyboardEvent) {
   if (this.specialKeys.indexOf(event.key) !== -1) {
     return;
   }

   // Verifica si el carácter es válido
   const isValidCharacter = this.regex.test(event.key);
   if (!isValidCharacter) {
     event.preventDefault();
   }
 }

 @HostListener('beforeinput', ['$event']) onBeforeInput(event: InputEvent) {
   if (!this.isActive) {
     return;
   }

   const input = this.el.nativeElement;
   const value = input.value;

   // Verifica el valor después de insertar el nuevo carácter
   const nextValue = value.slice(0, input.selectionStart) + event.data + value.slice(input.selectionEnd);

   if (!this.regex.test(nextValue)) {
     event.preventDefault();
   }
 }

 @HostListener('input', ['$event']) onInputChange(event: Event) {
   if (!this.isActive) {
     return;
   }

   const input = this.el.nativeElement;
   const value = input.value;

   if (!this.regex.test(value)) {
     const sanitizedValue = value.replace(/[^a-zA-Z0-9À-ÖØ-öø-ÿÑñÄäËëÏïÖöÜüŸÿ\s.,:;!?@#$%^&*()_+\-=\[\]{}|\\'"/<>\~`]/g, '');
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
