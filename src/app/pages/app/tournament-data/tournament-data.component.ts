import { Component } from '@angular/core';
import { RowComponent } from "../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../shared/components/layout/col/col.component";
import { TabsComponent } from "../../../shared/components/layout/tabs/tabs-container/tabs.component";
import { TabComponent } from "../../../shared/components/layout/tabs/tab/tab.component";
import { TournamentDataService } from './_services/tournament-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { catchError, concatMap, EMPTY, finalize, from, of, switchMap, tap, toArray } from 'rxjs';
import { WinConditionSelectComponent } from '../_components/win-condition-select/win-condition-select.component';
import { TypeSelectComponent } from '../_components/type-select/type-select.component';
import { TieBreakerSelectComponent } from '../_components/tie-breaker-select/tie-breaker-select.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tournament-data',
  imports: [RowComponent, ColComponent, TabsComponent, TabComponent, ReactiveFormsModule, ButtonComponent, InputComponent, WinConditionSelectComponent, TypeSelectComponent, TieBreakerSelectComponent],
  templateUrl: './tournament-data.component.html',
  styleUrl: './tournament-data.component.css',
  standalone: true
})
export class TournamentDataComponent {

  data: any = {};
  matches: any = {};
  formData!: FormGroup;
  disableForm: boolean = false;

  constructor(private tournamentDataServices: TournamentDataService, private route: ActivatedRoute, private toast: ToastService, private router: Router, private fb: FormBuilder) {
    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      players: this.fb.array([]),
      tournamentSpec: this.fb.group({
        pointsPerWin: ['', [Validators.pattern(/^[0-9]+$/)]],
        pointsPerDraw: ['', [Validators.pattern(/^[0-9]+$/)]],
        pointsPerLose: ['', [Validators.pattern(/^[0-9]+$/)]],
        qtyRounds: ['', [Validators.pattern(/^[0-9]+$/)]],
        qtyGroups: ['', [Validators.pattern(/^[0-9]+$/)]],
        winConditionId: ['', [Validators.required]],
        typeId: [{ value: '', disabled: true }],
        tieBreakerId: [''],
        matchDuration: ['']
      })
    });
  }

  ngOnInit() {
    this.getTournamentById();
    this.formData.get('tournamentSpec.typeId')?.valueChanges.subscribe(type => {
      const spec = this.formData.get('tournamentSpec') as FormGroup;

      if (type === 2) {
        spec.get("pointsPerWin")?.addValidators(Validators.required);
        spec.get("pointsPerDraw")?.addValidators(Validators.required);
        spec.get("pointsPerLose")?.addValidators(Validators.required);
        spec.get("qtyRounds")?.addValidators(Validators.required);
        spec.get("qtyGroups")?.addValidators(Validators.required);
        spec.get("matchDuration")?.addValidators(Validators.required);
        spec.get('tieBreakerId')?.addValidators(Validators.required);
      } else {
        spec.get("pointsPerWin")?.clearValidators();
        spec.get("pointsPerDraw")?.clearValidators();
        spec.get("pointsPerLose")?.clearValidators();
        spec.get("qtyRounds")?.clearValidators();
        spec.get("qtyGroups")?.clearValidators();
        spec.get("matchDuration")?.clearValidators();
        spec.get('tieBreakerId')?.clearValidators();
      }

      spec.updateValueAndValidity();
    });
  }

  get typeId() {
    return this.formData.get('tournamentSpec.typeId')?.value;
  }

  get playersArray() {
    return this.formData.get('players') as FormArray;
  }

  get removedPlayersCount(): number {
    return this.playersArray.controls.filter(
      item => item.value?._state === 'removed'
    ).length
  }

  getMatchFlex(roundIndex: number): number {
    return Math.pow(2, roundIndex);
  }

  createPlayer(state: 'original' | 'new' | 'removed' = 'original', players?: any): FormGroup {
    return this.fb.group({
      id: [players?.id || null],
      name: [{ value: players?.name || '', disabled: this.data.tournamentStatus.id !== 1 }, Validators.required],
      _state: [state] //original | new | removed
    })
  }

  addPlayer() {
    this.playersArray.push(this.createPlayer('new'));
  }

  removePlayer(idx: number) {
    const player = this.playersArray.at(idx) as FormGroup;

    if ((this.playersArray.length - this.removedPlayersCount) === 2) {
      this.toast.warning("Devem haver no mínimo dois jogadores!");
      return;
    }

    if (player.value.id) {
      player.patchValue({ _state: 'removed' });
    } else {
      this.playersArray.removeAt(idx);
    }
  }

  updatePlayerName(idx: number) {
    const player = this.playersArray.at(idx) as FormGroup;

    if (player.value.id) {
      player.patchValue({ _state: 'updated' });
    }
  }

  handleSubmit() {
    if (!this.formData.valid) {
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }
    this.disableForm = true;

    const toastId = this.toast.show({ message: "Iniciando torneio, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

    const tournamentSpec = this.formData.value.tournamentSpec;
    const tournament = this.formData.value;
    const players = this.formData.value.players || [];

    const newPlayers = players.filter((item: any) => item._state === 'new').map((item: any) => ({ name: item.name }));
    const removedPlayers = players.filter((item: any) => item._state === 'removed').map((item: any) => ({ id: item.id, name: item.name }));
    const updatedPlayers = players.filter((item: any) => item._state === 'updated').map((item: any) => ({ id: item.id, name: item.name }));

    const tournamentPayload = {
      name: tournament.name,
      statusId: 3
    }

    const tournamentSpecsPayload = {
      ...tournamentSpec,
      winConditionId: Number(tournamentSpec.winConditionId),
      typeId: Number(tournamentSpec.typeId),
      tieBreakerId: tournamentSpec.tieBreakerId ? Number(tournamentSpec.tieBreakerId) : null,
      pointsPerWin: tournamentSpec.pointsPerWin === '' ? null : Number(tournamentSpec.pointsPerWin),
      pointsPerDraw: tournamentSpec.pointsPerDraw === '' ? null : Number(tournamentSpec.pointsPerDraw),
      pointsPerLose: tournamentSpec.pointsPerLose === '' ? null : Number(tournamentSpec.pointsPerLose),
      qtyRounds: tournamentSpec.qtyRounds === '' ? null : Number(tournamentSpec.qtyRounds),
      qtyGroups: tournamentSpec.qtyGroups === '' ? null : Number(tournamentSpec.qtyGroups),
      matchDuration: tournamentSpec.matchDuration || null
    }

    this.tournamentDataServices.updateTournament(this.data.id, tournamentPayload).pipe(

      concatMap(() => this.tournamentDataServices.updateTournamentSpec(this.data.tournamentSpecs.id, tournamentSpecsPayload)),

      concatMap(() =>
        updatedPlayers.length
          ? from(updatedPlayers).pipe(
            concatMap((player: any) =>
              this.tournamentDataServices.updatePlayer(player.id, player)
            ), toArray()
          ) : of(null)
      ),

      concatMap(() =>
        removedPlayers.length
          ? from(removedPlayers).pipe(
            concatMap((player: any) =>
              this.tournamentDataServices.deletePlayer(player.id)
            ), toArray()
          ) : of(null)
      ),

      concatMap(() => newPlayers.length ? this.tournamentDataServices.addPlayers(this.data.id, newPlayers) : of(null)),

      concatMap(() => this.data.tournamentSpecs.type.id === 1 ? this.tournamentDataServices.createFirstKnockOutMatch(this.data.id) : of(null))

    ).subscribe({
      next: (_: any) => {
        this.toast.finishToast(toastId, { message: `Torneio iniciado com sucesso!`, type: 'success', duration: 500, closeable: true, persistent: false })
        this.disableForm = false;

        Swal.fire({
          title: "Torneio iniciado com sucesso. O que deseja fazer?",
          showCancelButton: true,
          cancelButtonColor: "red",
          cancelButtonText: "Voltar para o início",
          showConfirmButton: true,
          confirmButtonColor: "green",
          confirmButtonText: "Ir para o torneio",
        }).then((result) => {
          if (result.isConfirmed) {
            this.getTournamentById();
            return;
          }

          this.router.navigate(['/home']);
        });
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false });
        this.disableForm = false;
      }
    });
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
        this.formData.get('name')?.setValue(this.data.name);
        this.formData.get('tournamentSpec.winConditionId')?.setValue(this.data.tournamentSpecs.winCondition.id);
        this.formData.get('tournamentSpec.typeId')?.setValue(this.data.tournamentSpecs.type.id);

        if (this.data.tournamentSpecs.type.id === 2) {
          this.formData.get('tournamentSpec.tieBreakerId')?.setValue(this.data.tournamentSpecs.tieBreaker.id);
          this.formData.get('tournamentSpec.pointsPerWin')?.setValue(this.data.tournamentSpecs.pointsPerWin);
          this.formData.get('tournamentSpec.pointsPerDraw')?.setValue(this.data.tournamentSpecs.pointsPerDraw);
          this.formData.get('tournamentSpec.pointsPerLose')?.setValue(this.data.tournamentSpecs.pointsPerLose);
          this.formData.get('tournamentSpec.qtyRounds')?.setValue(this.data.tournamentSpecs.qtyRounds);
          this.formData.get('tournamentSpec.qtyGroups')?.setValue(this.data.tournamentSpecs.qtyGroups);
          this.formData.get('tournamentSpec.matchDuration')?.setValue(this.data.tournamentSpecs.matchDuration);
        }

        let players = this.data.playerDetails || [];
        this.playersArray.clear();
        players.map((item: any) => {
          this.playersArray.push(this.createPlayer('original', item));
        });

        if (this.data.tournamentStatus.id !== 1 && this.data.tournamentSpecs.type.id === 1) {
          let matches = this.data.matchDetails || [];

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

        this.applyStatusRules();
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false })
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false })
        this.router.navigate(['/home']);
      }
    });
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
      group: match.group,
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

      tap(() => this.getTournamentById()),

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

  applyStatusRules() {
    const spec = this.formData.get('tournamentSpec') as FormGroup;
    const isEditable = this.data.tournamentStatus?.id === 1;

    const name = this.formData.get('name');

    isEditable ? name?.enable() : name?.disable();

    Object.keys(spec.controls).forEach(key => {
      if (key === 'typeId') return;

      const control = spec.get(key);

      isEditable ? control?.enable() : control?.disable();
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
