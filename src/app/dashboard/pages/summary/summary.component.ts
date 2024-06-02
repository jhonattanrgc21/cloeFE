import { SummaryGraph } from '../../interfaces/summary-graph.interface';
import { SummaryService } from './../../services/summary.service';
import { Component, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {

	labelsRaeeTypeGraph: string [] = [];
	dataRaeeTypeGraph: number [] = [];
	labelsRaeeByStatusGraph: string [] = [];
	dataRaeeByStatusGraph: number [] = [];
	labelsUsersByRolGraph: string [] = [];
	dataUsersByRolraph: number [] = [];

	raeeTypeGraph!: Chart;
	graphOfChemicalMaterials!: Chart;

	constructor(private _summaryService: SummaryService) {
	}

	ngOnInit(): void {


		this._summaryService.getDataGraph().subscribe((res: SummaryGraph) => {

			this.labelsRaeeTypeGraph = res.raee_by_line_percent.map(item => item.line_name);
			this.dataRaeeTypeGraph = res.raee_by_line_percent.map(item => Number(item.raees_percentage));
			const data = {
				labels: this.labelsRaeeTypeGraph,
				datasets: [
					{
						label: 'Tipos de RAEE',
						data: this.dataRaeeTypeGraph,
						backgroundColor: [
							'rgba(77, 182, 172, 1)',
							'rgba(255, 204, 114, 1)',
							'rgba(30, 188, 229, 1)',
							'rgba(30, 350, 230, 1)',
						],
						hoverOffset: 4,
						cutout: 70,
					},
				],
			};

			this.raeeTypeGraph = new Chart('chart1', {
				type: 'doughnut' as ChartType,
				data,
				options: {
					responsive: true,
				},
			});

			const data2 = {
				labels: [
					'Polietileno',
					'Polipropileno',
					'PVC',
					'Aluminio',
					'Cobre',
					'Hierro',
					'Vídrio templado',
				],
				datasets: [
					{
						axis: 'y',
						label: 'Materiales químicos en existencia',
						data: [5, 10, 10, 15, 15, 23, 27],
						fill: false,
						backgroundColor: [
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
						],
						borderWidth: 1,
					},
				],
			};

			this.graphOfChemicalMaterials = new Chart('chart2', {
				type: 'bar' as ChartType,
				data: data2,
				options: {
					indexAxis: 'y',
					responsive: true,
					plugins: {
						legend: {
							display: false,
						},
					},
				},
			});

			this.labelsRaeeByStatusGraph = res.raee_by_status.map(item => item.status);
			this.dataRaeeByStatusGraph = res.raee_by_status.map(item => item.raees_count);

			const data3 = {
				labels: this.labelsRaeeByStatusGraph,
				datasets: [
					{
						label: 'Estatus por RAEE',
						data: this.dataRaeeByStatusGraph,
						backgroundColor: [
							'rgba(255, 204, 114, 1)',
							'rgba(30, 188, 229, 1)',
						],
						hoverOffset: 4,
						cutout: 70,
					},
				],
			};

			this.raeeTypeGraph = new Chart('chart3', {
				type: 'doughnut' as ChartType,
				data: data3,
				options: {
					responsive: true,
				},
			});

			this.labelsUsersByRolGraph = res.users_by_role_percent.map(item => item.role);
			this.dataUsersByRolraph = res.users_by_role_percent.map(item => Number(item.users_percentage));

			const data4 = {
				labels: this.labelsUsersByRolGraph,
				datasets: [
					{
						axis: 'y',
						label: 'Total de usuarios por rol',
						data: this.dataUsersByRolraph,
						fill: false,
						backgroundColor: [
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
							'rgba(77, 182, 172, 1)',
						],
						borderWidth: 1,
					},
				],

			};

			this.graphOfChemicalMaterials = new Chart('chart4', {
				type: 'bar' as ChartType,
				data: data4,
				options: {
					indexAxis: 'x',
					responsive: true,
					plugins: {
						legend: {
							display: false,
						},
					},
				},
			});


		});
	}
}
