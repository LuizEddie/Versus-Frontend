import { Component } from '@angular/core';
import { TabsComponent } from "../../../shared/components/tabs/tabs-container/tabs.component";
import { TabComponent } from "../../../shared/components/tabs/tab/tab.component";
import { TableComponent } from "../../../shared/components/table/table.component";
import { HomeService } from './_services/home.service';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-home',
  imports: [TabsComponent, TabComponent, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {
  dataEmAndamento = [];
  columnsEmAndamento: any[] = [];

  dataPlanejado = [];
  columnsPlanejado: any[] = [];

  dataFinalizado = [];
  columnsFinalizado: any[] = [];

  constructor(private homeService: HomeService, private toast: ToastService){

  }

  ngOnInit(){
    this.columnsEmAndamento = [
      { key: 'actions', label: 'Ações'},
      { key: 'nome', label: 'Nome'},
      { key: 'data_criacao', label: 'Data de Criação'},
      { key: 'tipo', label: 'Tipo'},
      { key: 'participantes', label: 'Participantes'},
    ];

    this.columnsPlanejado = [
      { key: 'actions', label: 'Ações'},
      { key: 'nome', label: 'Nome'},
      { key: 'data_criacao', label: 'Data de Criação'},
      { key: 'tipo', label: 'Tipo'},
    ];

    this.columnsFinalizado = [
      { key: 'actions', label: 'Ações'},
      { key: 'nome', label: 'Nome'},
      { key: 'data_criacao', label: 'Data de Criação'},
      { key: 'tipo', label: 'Tipo'},
      { key: 'participantes', label: 'Participantes'},
      { key: 'vencedor', label: 'Vencedor'},
      { key: 'data_finalizacao', label: 'Data de Finalização'},
    ];

    this.getTournaments();
  }

  getTournaments(){
    this.homeService.getTournaments().subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
