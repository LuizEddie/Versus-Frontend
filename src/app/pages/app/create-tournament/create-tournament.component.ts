import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";
import { ToastService } from '../../../shared/services/toast/toast.service';
import { CreateTournamentService } from './_services/create-tournament.service';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { RowComponent } from "../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../shared/components/layout/col/col.component";
import { TypeSelectComponent } from '../_components/type-select/type-select.component';
import { WinConditionSelectComponent } from '../_components/win-condition-select/win-condition-select.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-tournament',
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent, TypeSelectComponent, WinConditionSelectComponent, RowComponent, ColComponent],
  templateUrl: './create-tournament.component.html',
  styleUrl: './create-tournament.component.css',
  standalone: true
})
export class CreateTournamentComponent {
  formData!: FormGroup;
  disableForm: boolean = false;

  constructor(private fb: FormBuilder, private toast: ToastService, private createTournamentService: CreateTournamentService, private router: Router) {
    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      players: this.fb.array([]),
      tournamentSpec: this.fb.group({
        winConditionId: [null],
        typeId: [null, [Validators.required]]
      })
    });

    this.addPlayer();
    this.addPlayer();
  }

  ngOnInit() {
    this.formData.get('tournamentSpec.typeId')?.valueChanges.subscribe(type => {
      const spec = this.formData.get('tournamentSpec') as FormGroup;

      if (type === "1") {
        spec.get("winConditionId")?.addValidators(Validators.required);
      } else {
        spec.get("winConditionId")?.clearValidators();
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

        Swal.fire({
          title: "Torneio criado com sucesso. O que deseja fazer?",
          showCancelButton: true,
          cancelButtonColor: "red",
          cancelButtonText: "Criar novo torneio",
          showConfirmButton: true,
          confirmButtonColor: "green",
          confirmButtonText: "Ir para o torneio",
          showDenyButton: true,
          denyButtonColor: 'blue',
          denyButtonText: 'Voltar para o início'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate([`/tournament-data/${response.data.id}`])
            return;
          }

          if (result.isDenied) {
            this.router.navigate(['/home']);
            return;
          }
        });
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false })
        this.disableForm = false;
      }
    });
  }
}
