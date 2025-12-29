import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";
import { ToastService } from '../../../shared/services/toast/toast.service';
import { CreateTournamentService } from './_services/create-tournament.service';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { RowComponent } from "../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../shared/components/layout/col/col.component";
import { TieBreakerSelectComponent } from '../_components/tie-breaker-select/tie-breaker-select.component';
import { TypeSelectComponent } from '../_components/type-select/type-select.component';
import { WinConditionSelectComponent } from '../_components/win-condition-select/win-condition-select.component';

@Component({
  selector: 'app-create-tournament',
  imports: [InputComponent, ReactiveFormsModule, TieBreakerSelectComponent, ButtonComponent, TypeSelectComponent, WinConditionSelectComponent, RowComponent, ColComponent],
  templateUrl: './create-tournament.component.html',
  styleUrl: './create-tournament.component.css',
  standalone: true
})
export class CreateTournamentComponent {
  formData!: FormGroup;
  disableForm: boolean = false;

  constructor(private fb: FormBuilder, private toast: ToastService, private createTournamentService: CreateTournamentService) {
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
        typeId: ['', [Validators.required]],
        tieBreakerId: [''],
        matchDuration: ['']
      })
    });

    this.addPlayer();
    this.addPlayer();
  }

  ngOnInit() {
    this.formData.get('tournamentSpec.typeId')?.valueChanges.subscribe(type => {
      const spec = this.formData.get('tournamentSpec') as FormGroup;

      if (type === "2") {
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
    })
  }

  get typeId() {
    return this.formData.get('tournamentSpec.typeId')?.value;
  }

  get playersArray() {
    return this.formData.get('players') as FormArray;
  }

  createPlayer() {
    return this.fb.group({
      name: ['', Validators.required]
    })
  }

  addPlayer() {
    this.playersArray.push(this.createPlayer());
  }

  removePlayer(idx: number) {

    if (this.playersArray.length === 2) {
      this.toast.warning("Devem haver no mínimo dois jogadores!");
      return;
    }
    this.playersArray.removeAt(idx);
  }

  handleSubmit() {
    if (!this.formData.valid) {
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }
    this.disableForm = true;

    const toastId = this.toast.show({ message: "Criando torneio, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

    const tournamentSpec = this.formData.value.tournamentSpec;

    const payload = {
      ...this.formData.value,
      tournamentSpec: {
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
    }

    this.createTournamentService.createTournament(payload).subscribe({
      next: (response: any) => {
        this.formData.reset();
        this.playersArray.clear();
        this.addPlayer();
        this.addPlayer();
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false })
        this.disableForm = false;
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false })
        this.disableForm = false;
      }
    });
  }
}
