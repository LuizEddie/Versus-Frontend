import { Component } from '@angular/core';
import { RowComponent } from "../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../shared/components/layout/col/col.component";
import { TabsComponent } from "../../../shared/components/layout/tabs/tabs-container/tabs.component";
import { TabComponent } from "../../../shared/components/layout/tabs/tab/tab.component";
import { TournamentDataService } from './_services/tournament-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { ReactiveFormsModule } from '@angular/forms';
import { DataComponent } from "./_components/data/data.component";
import { KnockoutComponent } from "./_components/knockout/knockout.component";

@Component({
  selector: 'app-tournament-data',
  imports: [RowComponent, ColComponent, TabsComponent, TabComponent, ReactiveFormsModule, DataComponent, KnockoutComponent],
  templateUrl: './tournament-data.component.html',
  styleUrl: './tournament-data.component.css',
  standalone: true
})
export class TournamentDataComponent {

  data: any = {};

  constructor(private tournamentDataServices: TournamentDataService, private route: ActivatedRoute, private toast: ToastService, private router: Router) {}

  ngOnInit() {
    this.getTournamentById();
  }

  getTournamentById() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === null) {
      this.toast.warning("Torneio inválido");
      this.router.navigate(['/home']);
      return;
    }

    const toastId = this.toast.show({ message: "Carregando dados, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

    this.tournamentDataServices.getTournamentById(id).subscribe({
      next: (response: any) => {
        this.data = response.data;

        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false })
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false })
        this.router.navigate(['/home']);
      }
    });
  }

}
