import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[appSpecialCharactersDirective]',
})
export class SpecialCharactersDirectiveDirective {
	@Input() isActive: boolean = false;
  // Incluye letras, números, acentos, diéresis, caracteres especiales y espacios
  private regex: RegExp = /^[a-zA-Z0-9À-ÖØ-öø-ÿÑñÄäËëÏïÖöÜüŸÿ\s.,:;!?@#$%^&*()_+\-=\[\]{}|\\'"/<>\~`]*$/;

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    if (!this.isActive) {
      return;
    }

    const input = this.el.nativeElement;
    const value = input.value;

    if (!this.regex.test(value)) {
      input.value = value.replace(/[^a-zA-Z0-9À-ÖØ-öø-ÿÑñÄäËëÏïÖöÜüŸÿ\s.,:;!?@#$%^&*()_+\-=\[\]{}|\\'"/<>\~`]/g, '');
      event.preventDefault();
    }
  }
}
