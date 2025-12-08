import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TieBreakerSelectComponent } from "./_components/tie-breaker-select/tie-breaker-select.component";
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TypeSelectComponent } from "./_components/type-select/type-select.component";
import { WinConditionSelectComponent } from "./_components/win-condition-select/win-condition-select.component";

@Component({
  selector: 'app-create-tournament',
  imports: [InputComponent, ReactiveFormsModule, TieBreakerSelectComponent, ButtonComponent, TypeSelectComponent, WinConditionSelectComponent],
  templateUrl: './create-tournament.component.html',
  styleUrl: './create-tournament.component.css',
  standalone: true
})
export class CreateTournamentComponent {
  formData!: FormGroup;

  constructor(private fb: FormBuilder, private toast: ToastService) {
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
      } else {
        spec.get("pointsPerWin")?.clearValidators();
        spec.get("pointsPerDraw")?.clearValidators();
        spec.get("pointsPerLose")?.clearValidators();
        spec.get("qtyRounds")?.clearValidators();
        spec.get("qtyGroups")?.clearValidators();
        spec.get("matchDuration")?.clearValidators();
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
      console.log(this.formData);
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }

    console.log('opa');
  }
}
