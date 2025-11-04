import { Component } from '@angular/core';
import { TabsComponent } from "../../shared/components/tabs/tabs-container/tabs.component";
import { TabComponent } from "../../shared/components/tabs/tab/tab.component";
import { TableComponent } from "../../shared/components/table/table.component";

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
  }
}
