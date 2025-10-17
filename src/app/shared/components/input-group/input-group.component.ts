import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-group',
  imports: [ReactiveFormsModule],
  templateUrl: './input-group.component.html',
  styleUrl: './input-group.component.css',
  standalone: true
})
export class InputGroupComponent {
  @Input() addonIcon: string = '';
  @Input() iconOrText: string = 'text';
  @Input() addonText: string = '';
  @Input() beforeOrAfterInput: string = 'after';
  @Input() inputGroupAddonFunction?: () => void;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type = 'text';
  @Input() id?: string;
  @Input() required = false;

  value: any = '';
  disabled = false;

  constructor(@Optional() @Self() public ngControl: NgControl){
    if(this.ngControl){
      this.ngControl.valueAccessor = this;
    }
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void{
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event){
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

    // Funções utilitárias
  get control() {
    return this.ngControl?.control;
  }

  get invalid() {
    return this.control?.invalid && (this.control?.touched || this.control?.dirty);
  }
}
