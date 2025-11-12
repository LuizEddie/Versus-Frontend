import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TieBreakerSelectComponent } from "./_components/tie-breaker-select/tie-breaker-select.component";
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-create-tournament',
  imports: [InputComponent, ReactiveFormsModule, TieBreakerSelectComponent, ButtonComponent],
  templateUrl: './create-tournament.component.html',
  styleUrl: './create-tournament.component.css',
  standalone: true
})
export class CreateTournamentComponent {
  formData!: FormGroup;

  constructor(private fb: FormBuilder, private toast: ToastService){
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
        tieBreakerId: ['', [Validators.required]],
        matchDuration: ['']
      })
    });
  }

  handleSubmit(){
    if(!this.formData.valid){
      console.log(this.formData);
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }
  }
}
