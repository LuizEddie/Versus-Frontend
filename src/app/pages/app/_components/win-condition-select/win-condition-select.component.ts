import { Component, Input, Optional, Self } from '@angular/core';
import { WinCondition } from './_models/win-condition.models';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { WinConditionService } from './_services/win-condition.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../../shared/utils/api-error-messages';
import { getValidationMessage } from '../../../../shared/utils/validation-messages';

@Component({
  selector: 'app-win-condition-select',
  imports: [ReactiveFormsModule],
  templateUrl: './win-condition-select.component.html',
  styleUrl: './win-condition-select.component.css',
  standalone: true
})
export class WinConditionSelectComponent implements ControlValueAccessor {
  @Input() required: boolean = false;
  @Input() name: string = "winConditionId";

  disabled: boolean = false;
  winConditions: WinCondition[] = [];

  constructor(@Optional() @Self() public ngControl: NgControl, private winConditionService: WinConditionService, private toastService: ToastService){
    if(this.ngControl){
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(){
    this.getWinConditions();
  }

  writeValue(): void {}

  registerOnChange(): void{}

  registerOnTouched(): void {}

  setDisabledState(isDisabled: boolean): void{
    this.disabled = isDisabled;
  }

  getWinConditions(){
    this.winConditionService.getWinConditions().subscribe({
      next: (response: any) => this.winConditions = response.data,
      error: (err) => this.toastService.warning(handleErrorMessages(err))
    })
  }

  get control(): FormControl{
    return this.ngControl?.control as FormControl;
  }

  get invalid(){
    return this.control?.invalid && (this.control?.touched || this.control?.dirty);
  }

  get errorMessage(){
    return getValidationMessage(this.control?.errors ?? null);
  }
}
