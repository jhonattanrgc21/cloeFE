import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { State } from '../../interfaces/states.interface';
import { City } from '../../interfaces/cities.interface';
import { GatheringCenter } from '../../interfaces/gathering-center.interface';

@Component({
	selector: 'app-gathering-center',
	templateUrl: './gathering-center.component.html',
	styleUrls: ['./gathering-center.component.scss'],
})
export class GatheringCenterComponent {
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

	cities: City[] = [
		{
			id: 1,
			name: 'Valencia',
		},
		{
			id: 2,
			name: 'Guacara',
		},
		{
			id: 3,
			name: 'Los Guayos',
		},
		{
			id: 4,
			name: 'Bejuma',
		},
		{
			id: 5,
			name: 'Caracas',
		},
	];

	gatheringCenters: GatheringCenter[] = [
		{
			id: 1,
			city: {
				id: 3,
				name: 'Los Guayos',
			},
			state: {
				id: 2,
				name: 'Carabobo',
			},
			address: 'Calle Rosalia, Los Guayos 2011, Carabobo',
		},
		{
			id: 2,
			city: 		{
				id: 5,
				name: 'Caracas',
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
			},
			state:  {
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
			},
			state:  {
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
			},
			state:  {
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
			},
			state: {
				id: 1,
				name: 'Distrito capital',
			},
			address: 'MERCADO LA HOYADA, Caracas 1010, Distrito Capital',
		},
	];

	pageNumber: number = 1;
	pageSize: number = 6;
	pageSizeOptions: number[] = [6, 12, 18, 30, 60];

	constructor(private fb: FormBuilder, private router: Router) {
		this.locationForm = this.fb.group({
			city: [],
			state: [],
		});
	}

	handlePage(event: PageEvent): void {
		this.pageNumber = event.pageIndex + 1;
		this.pageSize = event.pageSize;
	}
}
