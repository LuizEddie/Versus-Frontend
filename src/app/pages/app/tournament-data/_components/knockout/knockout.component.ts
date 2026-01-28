import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TournamentDataService } from '../../_services/tournament-data.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import Swal from 'sweetalert2';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { handleErrorMessages } from '../../../../../shared/utils/api-error-messages';
import { RowComponent } from "../../../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../../../shared/components/layout/col/col.component";
import { ButtonComponent } from "../../../../../shared/components/layout/button/button.component";

@Component({
  selector: 'app-knockout',
  imports: [RowComponent, ColComponent, ButtonComponent],
  templateUrl: './knockout.component.html',
  styleUrl: './knockout.component.css',
  standalone: true
})
export class KnockoutComponent {
  @Input() data!: any;
  @Output() reloadTournament = new EventEmitter<void>();
  matches: any = [];

  constructor(private tournamentDataServices: TournamentDataService, private toast: ToastService, private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']?.currentValue) {
      this.loadMatches(changes['data'].currentValue);
    }
  }

  loadMatches(data: any) {
    let matches = data.matchDetails || [];

    let groupedByRound = matches.reduce((acc: any, match: any) => {
      const round = match.round ?? 'Sem rodada';

      if (!acc[round]) {
        acc[round] = [];
      }

      acc[round].push(match);

      return acc;
    }, {});

    this.matches = Object.entries(groupedByRound).map(([round, matches]) => ({
      round, matches
    }));
  }

  getMatchFlex(roundIndex: number): number {
    return Math.pow(2, roundIndex);
  }

  defineWinner(winner: any, match: any) {

    if (match?.winner !== null) {
      this.toast.warning("O vencedor já foi definido!");
      return;
    }

    Swal.fire({
      title: `Definir o ${winner.name} como vencedor da partida?`,
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "Não",
      showConfirmButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Sim",
    }).then((result) => {
      if (result.isConfirmed) {
        this.handleDefineWinner(winner, match);
      }
    });
  }

  defineNextMatch$(winner: any, match: any) {
    const round = this.getNextRound(match.round);

    const findParams = {
      key: +match.key % 2 === 0 ? +match.key / 2 : (+match.key + 1) / 2,
      tournamentId: this.data.id,
      round: round
    }

    return this.tournamentDataServices.findMatch(findParams).pipe(
      switchMap((response: any) => {
        const matchData = response.data;

        const updateParams = +match.key % 2 === 0 ? { player2Id: winner?.id } : { player1Id: winner?.id }

        return this.tournamentDataServices.updateMatch(matchData.id, updateParams);
      })
    );
  }

  handleDefineWinner(winner: any, match: any) {
    const toastId = this.toast.show({ message: "Carregando dados, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

    this.tournamentDataServices.defineWinner(match.id, winner.id).pipe(
      switchMap(() => {
        if (match.round === 'Final') return this.tournamentDataServices.updateTournament(this.data.id, { statusId: 2, winnerId: winner.id });
        return this.defineNextMatch$(winner, match);
      }),

      tap(() => this.reloadTournament.emit()),

      finalize(() => {
        this.toast.finishToast(toastId, { duration: 500, closeable: true, persistent: false })
      }),

      catchError(err => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false });
        return EMPTY;
      })

    ).subscribe(() => {
      if (match.round === 'Final') {
        this.toast.finishToast(toastId, { message: `Torneio Finalizado`, type: 'success', duration: 500, closeable: true, persistent: false });

        Swal.fire({
          title: `Parabéns ${winner.name}, você ganhou o torneio!`,
          text: 'O que deseja fazer agora?',
          showCancelButton: true,
          cancelButtonColor: "red",
          cancelButtonText: "Ficar na página atual",
          showConfirmButton: true,
          confirmButtonColor: "green",
          confirmButtonText: "Voltar para Home",
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) this.router.navigate(['/home']);
        });
      }
    });
  }

  defineWinnerButtonVariant(match: any, player: any) {
    if (match?.winner?.id === null || match?.winner?.id === undefined) return 'info';
    if (match?.winner?.id === player?.id) return 'success';
    if (match?.winner?.id !== player?.id) return 'danger';

    return 'primary';
  }

  private getNextRound(round: string): string {
    switch (round) {
      case '16-avos':
        return 'Oitavas';
      case 'Oitavas':
        return 'Quartas';
      case 'Quartas':
        return 'Semifinal';
      case 'Semifinal':
        return 'Final';
      default:
        return (+round.replace('-avos', '') / 2).toString() + '-avos';
    }
  }
}
