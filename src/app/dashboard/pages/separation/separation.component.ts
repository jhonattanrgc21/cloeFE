import { ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ClasificationService } from '../../services/clasification.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MatTabGroup } from '@angular/material/tabs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GenerarlService } from 'src/app/shared/services/generarl.service';

@Component({
	selector: 'app-separation',
	templateUrl: './separation.component.html',
	styleUrls: ['./separation.component.scss'],
})
export class SeparationComponent implements OnInit, OnDestroy {
	isActiveSeparationView: boolean = false;
	raeeSelected: any;
	clasificationAllList: any[] = [];
	clasificationList: any[] = [];
	separationList: any[] = [];
	private clasificationListSubscription!: Subscription;
	@ViewChild(MatTabGroup) matTabGroup: any;


	title = 'form-array';

  fg!: FormGroup
  dataSourcePacks!: MatTableDataSource<any>;
  displayedColumns = ['component','materials',  'weight', 'dimensiones', 'reutilizable', 'actions']


	constructor(
		private _clasificationService: ClasificationService,
		private _cdr: ChangeDetectorRef,
		private _alertService: AlertService,
		private _fb: FormBuilder,
		private _generalService: GenerarlService
	) {
		this.fg = this._fb.group({
      promos: this._fb.array([])
    });

	}

	ngOnInit(): void {
		this.clasificationListSubscription =
			this._clasificationService.clasificationList$.subscribe(
				(clasifications: any[]) => {
					this.clasificationAllList = clasifications;
					this.clasificationList = this.clasificationAllList.filter(
						(elem) => elem.status == 'Clasificado'
					);
					this.separationList = this.clasificationAllList.filter(
						(elem) => elem.status == 'Separado'
					);
				}
			);
	}



  get promos() {
    return this.fg.controls["promos"] as FormArray;
  };

  addLesson(): void {

    const lessonForm = this._fb.group({
			component: ['', [Validators.required, this._generalService.noWhitespaceValidator()]],
			materials: ['', [Validators.required, this._generalService.noWhitespaceValidator()]],
			weight: ['', [Validators.required, this._generalService.noWhitespaceValidator()]],
			dimensiones: ['', this._generalService.noWhitespaceValidator()],
			reutilizable: [false, [Validators.required, this._generalService.noWhitespaceValidator()]],
    });


    this.promos.push(lessonForm);
    this.dataSourcePacks = new MatTableDataSource(this.promos.controls);

    this._cdr.detectChanges();

  };


  deleteLesson(lessonIndex: number): void {

    this.promos.removeAt(lessonIndex);
    this.dataSourcePacks = new MatTableDataSource(this.promos.controls);

  };


  onSubmit() {
    console.log(this.promos.value)
  }

	newSeparation(raee: any){
		this.isActiveSeparationView = true;
		this.raeeSelected = raee;
		console.log('Clasificacion seleccionada: ', raee)
	}

	editSeparation(raee: any){
		this.isActiveSeparationView = true;
		this.raeeSelected = raee;
	}

	cancelSeparation(){
		this.isActiveSeparationView = false;
		this.raeeSelected = null;
	}

	ngOnDestroy(): void {
		if (this.clasificationListSubscription) {
			this._alertService.setAlert({ isActive: false, message: '' });
			this.clasificationListSubscription.unsubscribe();
		}
	}
}
