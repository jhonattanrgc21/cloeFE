import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'app-cloe-select-search',
	templateUrl: './cloe-select-search.component.html',
	styleUrls: ['./cloe-select-search.component.scss'],
})
export class CloeSelectSearchComponent
	implements ControlValueAccessor, OnInit, OnChanges
{
	@Input() label?: string;
	@Input() forName: string = '';
	@Input() options: any = [];
	@Input() placeholder: string = '';
	@Input() isDisabled: boolean = false;
	@Input() isMultiple: boolean = false;

	control: FormControl = new FormControl();
	isInputActive: boolean = false;
	@ViewChild('mySelect') mySelect!: NgSelectComponent;

	constructor(
		@Optional() @Self() private ngControl: NgControl,
		private cdr: ChangeDetectorRef
	) {
		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}
	}

	ngOnInit(): void {
		this.control = this.ngControl.control as FormControl;
		if (this.control.value) {
			this.control.setValue(this.control.value); // Establecer el valor del FormControl
			this.cdr.detectChanges(); // Forzar la detección de cambios en la vista del ng-select
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ('isDisabled' in changes) {
			this.isDisabled = changes['isDisabled'].currentValue;
		}

		if ('options' in changes && changes['options'].currentValue) {
			this.cdr.detectChanges(); // Actualizar la vista cuando cambian las opciones
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

	onLabelClick() {
		if (this.mySelect) {
			this.mySelect.focus();
		}
	}
}
