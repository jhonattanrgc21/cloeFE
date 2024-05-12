import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { State } from '../../interfaces/states.interface';
import { City } from '../../interfaces/cities.interface';
import { GatheringCenter } from '../../interfaces/gathering-center.interface';

@Component({
	selector: 'app-gathering-center',
	templateUrl: './gathering-center.component.html',
	styleUrls: ['./gathering-center.component.scss'],
})
export class GatheringCenterComponent implements OnInit {
	locationForm: FormGroup;
	states: State[] = [
		{
			id: 1,
			name: 'Distrito capital',
		},
		{
			id: 2,
			name: 'Carabobo',
		},
		{
			id: 3,
			name: 'Aragua',
		},
		{
			id: 4,
			name: 'Miranda',
		},
		{
			id: 5,
			name: 'Lara',
		},
		{
			id: 6,
			name: 'Mérida',
		},
	];

	originalCities: City[] = [];
	cities: City[] = [
		{
			id: 1,
			name: 'Valencia',
			parentStateId: 2,
		},
		{
			id: 2,
			name: 'Guacara',
			parentStateId: 4,
		},
		{
			id: 3,
			name: 'Los Guayos',
			parentStateId: 2,
		},
		{
			id: 4,
			name: 'Bejuma',
			parentStateId: 5,
		},
		{
			id: 5,
			name: 'Caracas',
			parentStateId: 1,
		},
	];

	gatheringCenters: GatheringCenter[] = [
		{
			id: 1,
			city: {
				id: 3,
				name: 'Los Guayos',
				parentStateId: 2,
			},
			state: {
				id: 2,
				name: 'Carabobo',
			},
			address: 'Calle Rosalia, Los Guayos 2011, Carabobo',
		},
		{
			id: 2,
			city: {
				id: 5,
				name: 'Caracas',
				parentStateId: 1,
			},
			state: {
				id: 1,
				name: 'Distrito capital',
			},
			address: 'Caracas 1011, Distrito Capital',
		},
		{
			id: 3,
			city: {
				id: 1,
				name: 'Valencia',
				parentStateId: 2,
			},
			state: {
				id: 2,
				name: 'Carabobo',
			},
			address: 'local 85-23, entre infante y sucre, Calle Montes de oca.',
		},
		{
			id: 4,
			city: {
				id: 1,
				name: 'Valencia',
				parentStateId: 1,
			},
			state: {
				id: 2,
				name: 'Carabobo',
			},
			address: 'Av. México, Caracas 1014, Distrito Capital',
		},
		{
			id: 5,
			city: {
				id: 1,
				name: 'Valencia',
				parentStateId: 1,
			},
			state: {
				id: 2,
				name: 'Carabobo',
			},
			address: 'MERCADO LA HOYADA, Caracas 1010, Distrito Capital',
		},
		{
			id: 6,
			city: {
				id: 1,
				name: 'Valencia',
				parentStateId: 1,
			},
			state: {
				id: 2,
				name: 'Carabobo',
			},
			address: 'Caracas 1011, Distrito Capital',
		},
		{
			id: 7,
			city: {
				id: 1,
				name: 'Valencia',
				parentStateId: 1,
			},
			state: {
				id: 1,
				name: 'Distrito capital',
			},
			address: 'Calle Rosalia, Los Guayos 2011, Carabobo',
		},
		{
			id: 8,
			city: {
				id: 1,
				name: 'Valencia',
				parentStateId: 1,
			},
			state: {
				id: 1,
				name: 'Distrito capital',
			},
			address: 'MERCADO LA HOYADA, Caracas 1010, Distrito Capital',
		},
	];

	filteredGatheringCenters: GatheringCenter[] = [];

	pageNumber: number = 1;
	pageSize: number = 6;
	pageSizeOptions: number[] = [6, 12, 18, 30, 60];

	constructor(private _fb: FormBuilder) {
		this.locationForm = this._fb.group({
			city: [],
			state: [],
		});
	}

	ngOnInit() {
		this.filteredGatheringCenters = this.gatheringCenters;
		this.originalCities = [...this.cities];
		this.locationForm.valueChanges.subscribe(() => {
			this.applyFilters();
		});
	}

	applyFilters(): void {
    const stateId = this.locationForm.get('state')?.value;
    const cityId = this.locationForm.get('city')?.value;

    this.filteredGatheringCenters = this.gatheringCenters.filter(center => {
        return (!stateId || center.state.id === stateId) && (!cityId || center.city.id === cityId);
    });

    if (stateId) this.cities = this.originalCities.filter(city => city.parentStateId === stateId);
    else this.cities = [...this.originalCities];
}


	handlePage(event: PageEvent): void {
		this.pageNumber = event.pageIndex + 1;
		this.pageSize = event.pageSize;
	}
}
