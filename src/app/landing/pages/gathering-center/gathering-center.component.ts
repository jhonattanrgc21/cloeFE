import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { GatheringCenterCard } from '../../interfaces/gathering-center.interface';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SelectionInput } from 'src/app/shared/interfaces/selection-input.interface';
import { SelectFilter } from 'src/app/shared/interfaces/filters.interface';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
	selector: 'app-gathering-center',
	templateUrl: './gathering-center.component.html',
	styleUrls: ['./gathering-center.component.scss'],
})
export class GatheringCenterComponent implements OnInit, OnDestroy {

  private readonly _destroyed$ = new Subject<void>();
	locationForm!: FormGroup;
	statesList: SelectionInput[] = [];
	citiesList: SelectionInput[] = [];
	gatheringCentersList: GatheringCenterCard[] = [];

	pageNumber: number = 1;
	pageSize: number = 6;
	pageSizeOptions: number[] = [6, 12, 18, 30, 60];

  constructor(
    private _fb: FormBuilder,
    private _generalService: GeneralService
  ) {
    this.initForm();
  }

	ngOnInit(): void {
		const centersFilter: SelectFilter = { filters: { estado_id: null, ciudad_id: null } };
		this._generalService.getGatheringCenters(centersFilter).subscribe(res => {
			this.gatheringCentersList = res.success ? res.data : [];
		});
		this.loadStates();
		this.setupValueChangeSubscriptions();
	}

  initForm(): void {
    this.locationForm = this._fb.group({
      state: [],
      city:  [{ value: null, disabled: true }] ,
    });
  }

  loadStates(): void {
    this._generalService.getStates()
      .pipe(takeUntil(this._destroyed$))
      .subscribe(res => {
        this.statesList = res.success ? res.data : [];
      });
  }

  setupValueChangeSubscriptions(): void {
    this.locationForm.get('state')?.valueChanges
      .pipe(
        takeUntil(this._destroyed$)
      )
      .subscribe(stateId => {
        // Verificar si el estado está seleccionado
        if (!stateId) {
          // Si no hay estado seleccionado, resetear y deshabilitar el campo de la ciudad
          this.locationForm.get('city')?.reset();
          this.locationForm.get('city')?.disable();
        } else {
          // Si hay un estado seleccionado, habilitar el campo de la ciudad
          this.locationForm.get('city')?.enable();
          // Obtener ciudades para el estado seleccionado
          const stateSelectionFilter: SelectFilter = { filters: { estado_id: stateId } };
          this._generalService.getCities(stateSelectionFilter)
            .pipe(
              switchMap(res => {
                this.citiesList = res.success ? res.data : [];
                const hasCities = this.citiesList.length > 0;
                if (!hasCities) {
                  // Si no hay ciudades disponibles, resetear y deshabilitar el campo de la ciudad
                  this.locationForm.get('city')?.reset();
                  this.locationForm.get('city')?.disable();
                } else {
                  // Si hay ciudades disponibles, habilitar el campo de la ciudad
                  this.locationForm.get('city')?.enable();
                }
                return this._generalService.getGatheringCenters(stateSelectionFilter);
              })
            )
            .subscribe(res => {
              this.gatheringCentersList = res.success ? res.data : [];
            });
        }
      });

    this.locationForm.get('city')?.valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        switchMap(cityId => {
          const stateId = this.locationForm.get('state')?.value;
          const centersFilter: SelectFilter = { filters: { estado_id: stateId, ciudad_id: cityId } };
          return this._generalService.getGatheringCenters(centersFilter);
        })
      )
      .subscribe(res => {
        this.gatheringCentersList = res.success ? res.data : [];
      });
  }
	handlePage(event: PageEvent): void {
		this.pageNumber = event.pageIndex + 1;
		this.pageSize = event.pageSize;
	}

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
