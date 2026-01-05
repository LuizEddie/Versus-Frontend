import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TabsComponent } from "../../../shared/components/layout/tabs/tabs-container/tabs.component";
import { TabComponent } from "../../../shared/components/layout/tabs/tab/tab.component";
import { TableComponent } from "../../../shared/components/layout/table/table.component";
import { HomeService } from './_services/home.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { DropdownComponent } from "../../../shared/components/layout/dropdown/dropdown/dropdown.component";
import { DropdownItemComponent } from "../../../shared/components/layout/dropdown/dropdown-item/dropdown-item.component";
import { SwalComponent, SwalDirective } from "@sweetalert2/ngx-sweetalert2";
import { RouterLink } from "@angular/router";
import { ColComponent } from "../../../shared/components/layout/col/col.component";
import { RowComponent } from '../../../shared/components/layout/row/row.component';

@Component({
  selector: 'app-home',
  imports: [TabsComponent, TabComponent, TableComponent, DropdownComponent, DropdownItemComponent, SwalComponent, SwalDirective, RouterLink, ColComponent, RowComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {
  @ViewChild('actionPlanejado', { static: true}) actionPlanejado!: TemplateRef<any>;
  @ViewChild('actionEmAndamento', { static: true}) actionEmAndamento!: TemplateRef<any>;
  @ViewChild('actionFinalizado', { static: true}) actionFinalizado!: TemplateRef<any>;

  selectedData: any = null;

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
      { key: 'actions', label: 'Ações', template: this.actionEmAndamento},
      { key: 'nome', label: 'Nome'},
      { key: 'data_criacao', label: 'Data de Criação'},
      { key: 'tipo', label: 'Tipo'},
      { key: 'participantes', label: 'Participantes'},
    ];

    this.columnsPlanejado = [
      { key: 'actions', label: 'Ações', template: this.actionPlanejado},
      { key: 'nome', label: 'Nome'},
      { key: 'data_criacao', label: 'Data de Criação'},
      { key: 'tipo', label: 'Tipo'},
      { key: 'participantes', label: 'Participantes'},
    ];

    this.columnsFinalizado = [
      { key: 'actions', label: 'Ações', template: this.actionFinalizado},
      { key: 'nome', label: 'Nome'},
      { key: 'data_criacao', label: 'Data de Criação'},
      { key: 'tipo', label: 'Tipo'},
      { key: 'participantes', label: 'Participantes'},
      { key: 'vencedor', label: 'Vencedor'},
      { key: 'data_finalizacao', label: 'Data de Finalização'},
    ];

    this.getTournaments();
  }

  cancelTournament(id: number){
    const toastId = this.toast.show({ message: "Removendo dados, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });
    
    this.homeService.cancelTournamentById(id).subscribe({
      next: (response: any) => {
        this.getTournaments();
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false });
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false });
      }
    });
  }

  getTournaments(){
    const toastId = this.toast.show({ message: "Carregando dados, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });
    
    this.homeService.getTournaments().subscribe({
      next: (response: any) => {
        let data = response.data.map((item: any) => ({
          id: item.id || '',
          nome: item.name || '',
          data_criacao: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '',
          status: item.tournamentStatus.name || '',
          tipo: item.tournamentSpecs.type.name || '',
          participantes: item.playerDetails.length || 0,
          vencedor: item?.winnerDetails?.name || '',
          data_finalizacao: item.finishedAt ? new Date(item.finishedAt).toLocaleDateString('pt-BR') : ''
        })) || [];
        this.dataEmAndamento = data.filter((item: any) => item.status === "Em Andamento");
        this.dataPlanejado = data.filter((item: any) => item.status === "Planejado");
        this.dataFinalizado = data.filter((item: any) => item.status === "Finalizado");
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false })
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false })
      }
    });
  }
}
