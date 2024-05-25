import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { GatheringCenter, GatheringCenterCard } from '../../interfaces/gathering-center.interface';
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

	// constructor(
	// 	private _fb: FormBuilder,
	// 	private _generalService: GeneralService
	// ) {

	// 	this._generalService.getStates().subscribe(res => {
	// 		if (res.success) this.statesList = res.data;
	// 		else this.statesList = [];
	// 	});

	// 	this.locationForm = this._fb.group({
	// 		city: [],
	// 		state: [],
	// 	});

	// 	this.locationForm.get('state')?.valueChanges.subscribe((stateId) => {
	// 		this.locationForm.get('city')?.reset();
	// 		const stateSelectionFilter: SelectFilter = {
	// 			filters: { estado_id: stateId },
	// 		};

	// 		this._generalService.getGatheringCenters(stateSelectionFilter).subscribe(res => {
	// 			if (res.success) {
	// 				this.gatheringCentersList = res.data;
	// 			} else this.gatheringCentersList = [];
	// 		})

	// 		this._generalService.getCities(stateSelectionFilter).subscribe((res) => {
	// 			if (res.success) {
	// 				this.citiesList = res.data;
	// 			} else this.citiesList = [];
	// 		});
	// 	});

	// 	this.locationForm.get('city')?.valueChanges.subscribe((cityId) => {
	// 		const stateId = this.locationForm.get('state')?.value;
	// 		const centersFilter: SelectFilter = {
	// 			filters: { estado_id: stateId, municipio_id: cityId },
	// 		};
	// 		this._generalService.getGatheringCenters(centersFilter).subscribe(res => {
	// 			if (res.success) {
	// 				this.gatheringCentersList = res.data;
	// 			} else this.gatheringCentersList = [];
	// 		})
	// 	})
	// }

	// ngOnInit() {

	// }


  constructor(
    private _fb: FormBuilder,
    private _generalService: GeneralService
  ) {
    this.initForm();
  }

	ngOnInit(): void {
		this.loadStates();
		this.setupValueChangeSubscriptions();
	}

  initForm(): void {
    this.locationForm = this._fb.group({
      state: [],
      city: [],
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
        takeUntil(this._destroyed$),
        switchMap(stateId => {
          this.locationForm.get('city')?.reset();
          const stateSelectionFilter: SelectFilter = { filters: { estado_id: stateId } };
          return this._generalService.getCities(stateSelectionFilter)
            .pipe(
              switchMap(res => {
                this.citiesList = res.success ? res.data : [];
                return this._generalService.getGatheringCenters(stateSelectionFilter);
              })
            );
        })
      )
      .subscribe(res => {
        this.gatheringCentersList = res.success ? res.data : [];
      });

    this.locationForm.get('city')?.valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        switchMap(cityId => {
          const stateId = this.locationForm.get('state')?.value;
          const centersFilter: SelectFilter = { filters: { estado_id: stateId, municipio_id: cityId } };
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
