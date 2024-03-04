import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RegisteredUsers } from '../../interfaces/registered-users.interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent  implements AfterViewInit {
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
