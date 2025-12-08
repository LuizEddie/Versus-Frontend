import { Component, Input, Optional, Self } from '@angular/core';
import { WinCondition } from './_models/win-condition.models';
import { NgControl } from '@angular/forms';
import { WinConditionService } from './_services/win-condition.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../../../shared/utils/api-error-messages';
import { getValidationMessage } from '../../../../../shared/utils/validation-messages';

@Component({
  selector: 'app-win-condition-select',
  imports: [],
  templateUrl: './win-condition-select.component.html',
  styleUrl: './win-condition-select.component.css'
})
export class WinConditionSelectComponent {
  @Input() required: boolean = false;
  @Input() name: string = "typeId";

  disabled: boolean = false;
  value: any = "";

  winConditions: WinCondition[] = [];

  constructor(@Optional() @Self() public ngControl: NgControl, private winConditionService: WinConditionService, private toastService: ToastService){
    if(this.ngControl){
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(){
    this.getWinConditions();
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? "";
  }

  registerOnChange(fn: any): void{
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void{
    this.disabled = isDisabled;
  }

  handleSelect(event: Event){
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  getWinConditions(){
    this.winConditionService.getWinConditions().subscribe({
      next: (response: any) => this.winConditions = response.data,
      error: (err) => this.toastService.warning(handleErrorMessages(err))
    })
  }

  get control(){
    return this.ngControl?.control;
  }

  get invalid(){
    return this.control?.invalid && (this.control?.touched || this.control?.dirty);
  }

  get errorMessage(){
    return getValidationMessage(this.control?.errors ?? null);
  }
}
