import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-tournament',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './create-tournament.component.html',
  styleUrl: './create-tournament.component.css',
  standalone: true
})
export class CreateTournamentComponent {
  formData!: FormGroup;

  constructor(private fb: FormBuilder){
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
}
