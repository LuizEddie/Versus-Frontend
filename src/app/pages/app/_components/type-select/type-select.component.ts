import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Type } from './_models/type.models';
import { TypeService } from './_services/type.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../../shared/utils/api-error-messages';
import { getValidationMessage } from '../../../../shared/utils/validation-messages';


@Component({
  selector: 'app-type-select',
  imports: [ReactiveFormsModule],
  templateUrl: './type-select.component.html',
  styleUrl: './type-select.component.css',
  standalone: true
})
export class TypeSelectComponent implements ControlValueAccessor {
  @Input() required: boolean = false;
  @Input() name: string = "typeId";

  disabled: boolean = false;
  types: Type[] = [];

  constructor(@Optional() @Self() public ngControl: NgControl, private typeService: TypeService, private toastService: ToastService){
    if(this.ngControl){
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(){
    this.getTypes();
  }

  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getTypes(){
    this.typeService.getTypes().subscribe({
      next: (response: any) => this.types = response.data,
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
