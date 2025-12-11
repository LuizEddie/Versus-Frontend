import { Component, Input, Optional, Self } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { getValidationMessage } from '../../../../../shared/utils/validation-messages';
import { TieBreakerService } from './_services/tie-breaker.service';
import { TieBreaker } from './_models/tie-breaker.models';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../../../shared/utils/api-error-messages';

@Component({
  selector: 'app-tie-breaker-select',
  imports: [],
  templateUrl: './tie-breaker-select.component.html',
  styleUrl: './tie-breaker-select.component.css',
  standalone: true
})
export class TieBreakerSelectComponent {
  @Input() required: boolean = false;
  @Input() name: string = 'tieBreakerId';

  disabled: boolean = false;
  value: any = '';

  tieBreakers: TieBreaker[] = [];

  constructor(@Optional() @Self() public ngControl: NgControl, private tieBreakerService: TieBreakerService, private toastService: ToastService){
    if(this.ngControl){
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(){
    this.getTieBreakers();
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleSelect(event: Event){
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  getTieBreakers(){
    this.tieBreakerService.getTieBreakers().subscribe({
      next: (response: any) => this.tieBreakers = response.data,
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
