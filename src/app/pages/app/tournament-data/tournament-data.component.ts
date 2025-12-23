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
import { WinConditionSelectComponent } from "../create-tournament/_components/win-condition-select/win-condition-select.component";
import { TypeSelectComponent } from "../create-tournament/_components/type-select/type-select.component";
import { TieBreakerSelectComponent } from "../create-tournament/_components/tie-breaker-select/tie-breaker-select.component";

@Component({
  selector: 'app-tournament-data',
  imports: [RowComponent, ColComponent, TabsComponent, TabComponent, ReactiveFormsModule, ButtonComponent, InputComponent, WinConditionSelectComponent, TypeSelectComponent, TieBreakerSelectComponent],
  templateUrl: './tournament-data.component.html',
  styleUrl: './tournament-data.component.css',
  standalone: true
})
export class TournamentDataComponent {

  data: any = {}
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
        typeId: ['', [Validators.required]],
        tieBreakerId: [''],
        matchDuration: ['']
      })
    });
  }

  ngOnInit() {
    this.getTournamentById();
    this.formData.get('tournamentSpec.typeId')?.valueChanges.subscribe(type => {
      const spec = this.formData.get('tournamentSpec') as FormGroup;

      if (type === "2") {
        spec.get("pointsPerWin")?.addValidators(Validators.required);
        spec.get("pointsPerDraw")?.addValidators(Validators.required);
        spec.get("pointsPerLose")?.addValidators(Validators.required);
        spec.get("qtyRounds")?.addValidators(Validators.required);
        spec.get("qtyGroups")?.addValidators(Validators.required);
        spec.get("matchDuration")?.addValidators(Validators.required);
      } else {
        spec.get("pointsPerWin")?.clearValidators();
        spec.get("pointsPerDraw")?.clearValidators();
        spec.get("pointsPerLose")?.clearValidators();
        spec.get("qtyRounds")?.clearValidators();
        spec.get("qtyGroups")?.clearValidators();
        spec.get("matchDuration")?.clearValidators();
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

    // const toastId = this.toast.show({ message: "Criando torneio, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

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
        console.log(this.data);
        this.formData.get('name')?.setValue(this.data.name);
        this.formData.get('tournamentSpec.winConditionId')?.setValue(this.data.tournamentSpecs.winCondition.id);
        this.formData.get('tournamentSpec.typeId')?.setValue(this.data.tournamentSpecs.type.id);
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false })
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false })
        this.router.navigate(['/home']);
      }
    });
  }
}
