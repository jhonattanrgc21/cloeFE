import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RegisteredUsers } from '../../interfaces/registered-users.interface';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent  implements OnInit , AfterViewInit {

  displayedColumns: string[] = ['name', 'employePosition', 'identification', 'address', 'status'];
  registeredUsers: RegisteredUsers[] = [
    {
      name: 'Ricardo hernández',
      employePosition: 'Encargado',
      identification: 'V-15.478.569',
      address: 'Av. Bolívar, Torre C3, Piso 6, Oficina #4',
      status: 'Activo'
    },
    {
      name: 'Jonathan Guerra',
      employePosition: 'Clasificador',
      identification: 'V-14.547.002',
      address: 'Esq. Candilito a Cruz De La Candelaria',
      status: 'Inactivo'
    },
    {
      name: 'Benjamín González',
      employePosition: 'Separador',
      identification: 'V-17.548.663',
      address: 'Nivel PB, Local 03, Sector Centro',
      status: 'Activo'
    },
    {
      name: 'María Pérez',
      employePosition: 'Clasificador',
      identification: 'V-19.225.540',
      address: 'Piso 6, Oficina 611, Urbanización Viñedo',
      status: 'Inactivo'
    },
    {
      name: 'Eugenia López',
      employePosition: 'Separador',
      identification: 'V-10.002.457',
      address: 'Piso PB, Oficina 5, Sector Sabana Grande',
      status: 'Activo'
    }
  ]

  dataSource = new MatTableDataSource<RegisteredUsers>(this.registeredUsers);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

	raeeTypeGraph!: Chart;
	graphOfChemicalMaterials!: Chart;


	ngOnInit(): void {
		const data = {
			labels: [
				'Blanca',
				'Gris',
				'Marrón'
			],
			datasets: [{
				label: 'Tipos de RAEE',
				data: [30, 50, 20],
				backgroundColor: [
					'rgba(77, 182, 172, 1)',
					'rgba(228, 228, 228, 1)',
					'rgba(30, 188, 229, 1)'
				],
				hoverOffset: 4,
				cutout: 100,
			}],

		};

		this.raeeTypeGraph = new Chart('chart1', {
			type: 'doughnut' as ChartType,
			data,
			options: {
				responsive: true,
			}
		});

		const data2 = {
			labels: ['Polietileno', 'Polipropileno', 'PVC', 'Aluminio', 'Cobre', 'Hierro', 'Vídrio templado'],
			datasets: [{
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
				borderWidth: 1
			}]
		};

		this.graphOfChemicalMaterials = new Chart("chart2", {
			type: 'bar' as ChartType,
			data: data2,
			options: {
				indexAxis: 'y',
				responsive: true,
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});

	}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

		this.dataSource.filterPredicate = (data: RegisteredUsers, filter: string) => {
			const searchData = `${data.name} ${data.employePosition} ${data.identification} ${data.address} ${data.status}`.toLowerCase();
			return searchData.includes(filter.trim().toLowerCase());
		};

		this.dataSource.filterPredicate = (data: RegisteredUsers, filter: string) => {
			const searchData = `${data.name} ${data.employePosition} ${data.identification} ${data.address}`.toLowerCase();
			const statusMatch = data.status.toLowerCase() === filter.trim().toLowerCase();
			const otherColumnsMatch = searchData.includes(filter.trim().toLowerCase());
			return statusMatch || otherColumnsMatch;
		};

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
