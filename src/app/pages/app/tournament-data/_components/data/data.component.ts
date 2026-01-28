import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { RowComponent } from "../../../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../../../shared/components/layout/col/col.component";
import { InputComponent } from "../../../../../shared/components/layout/input/input.component";
import { WinConditionSelectComponent } from "../../../_components/win-condition-select/win-condition-select.component";
import { TypeSelectComponent } from "../../../_components/type-select/type-select.component";
import { ButtonComponent } from "../../../../../shared/components/layout/button/button.component";
import { TournamentDataService } from '../../_services/tournament-data.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { handleErrorMessages } from '../../../../../shared/utils/api-error-messages';
import Swal from 'sweetalert2';
import { concatMap, from, of, toArray } from 'rxjs';

@Component({
  selector: 'app-data',
  imports: [ReactiveFormsModule, RowComponent, ColComponent, InputComponent, WinConditionSelectComponent, TypeSelectComponent, ButtonComponent],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css',
  standalone: true
})
export class DataComponent {
  @Input() data!: any;
  @Output() reloadTournament = new EventEmitter<void>();

  formData!: FormGroup;
  disableForm: boolean = false;

  constructor(private tournamentDataServices: TournamentDataService, private toast: ToastService, private router: Router, private fb: FormBuilder) {
    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      players: this.fb.array([]),
      tournamentSpec: this.fb.group({
        winConditionId: ['', [Validators.required]],
        typeId: [{ value: '', disabled: true }],
      })
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']?.currentValue) {
      this.formData.reset();
      this.playersArray.clear();
      this.loadForm(changes['data'].currentValue);
    }
  }

  ngOnInit() {
    this.formData.get('tournamentSpec.typeId')?.valueChanges.subscribe(type => {
      const spec = this.formData.get('tournamentSpec') as FormGroup;

     if (type === 1) {
        spec.get("winConditionId")?.addValidators(Validators.required);
      } else {
        spec.get("winConditionId")?.clearValidators();
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

  loadForm(data: any) {
    if (
      !data ||
      !data.tournamentSpecs ||
      !data.tournamentSpecs.winCondition ||
      !data.tournamentSpecs.type
    ) {
      return;
    }

    this.formData.get('name')?.setValue(data.name);
    this.formData.get('tournamentSpec.typeId')?.setValue(data.tournamentSpecs.type.id);

    if(data.tournamentSpecs.type.id === 1){
      this.formData.get('tournamentSpec.winConditionId')?.setValue(data.tournamentSpecs.winCondition.id);
    }

    let players = data.playerDetails || [];
    this.playersArray.clear();

    players.map((item: any) => {
      this.playersArray.push(this.createPlayer('original', item));
    });

    this.applyStatusRules();

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
      typeId: Number(tournamentSpec.typeId)
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
            this.reloadTournament.emit();
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

}
