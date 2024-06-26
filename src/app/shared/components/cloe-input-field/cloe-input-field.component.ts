import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
	selector: 'app-cloe-input-field',
	templateUrl: './cloe-input-field.component.html',
	styleUrls: ['./cloe-input-field.component.scss'],
})
export class CloeInputFieldComponent
	implements ControlValueAccessor, OnInit, OnChanges
{
	@Input() label?: string;
	@Input() forName: string = '';
	@Input() typeInput: 'text' | 'email' | 'password' | 'textarea' | 'select' =
		'text';
	@Input() placeholder: string = '';
	@Input() rows: string = '10';
	@Input() isDisabled: boolean = false;
	@Input() options: string[] = [];
  @Input() mask: string = "";
	control: FormControl = new FormControl(null);
	isInputActive: boolean = false;
	showPassword: boolean = false;

	constructor(@Optional() @Self() private ngControl: NgControl, private cdr: ChangeDetectorRef) {

		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}
	}

	ngOnInit(): void {
		this.control = this.ngControl.control as FormControl;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ('isDisabled' in changes) {
			this.isDisabled = changes['isDisabled'].currentValue;
		}
	}

	writeValue(obj: any): void {}

	registerOnChange(fn: any): void {}

	registerOnTouched(fn: any): void {}

	setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
		this.cdr.detectChanges();
	}

	onInputFocus() {
		this.isInputActive = true;
	}

	onInputBlur() {
		this.isInputActive = false;
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
	}
}
