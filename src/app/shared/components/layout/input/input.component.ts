import { Component, ElementRef, EventEmitter, input, Input, Optional, Output, Self, ViewChild } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { getValidationMessage } from '../../../utils/validation-messages';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class InputComponent {
  @ViewChild('nativeInput') nativeInput!: ElementRef<HTMLInputElement>;

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() accept: string = '';
  @Input() multiple: boolean = false;

  @Output() fileChange = new EventEmitter<Event>();
  @Output() valueChange = new EventEmitter<any>();

  value: any = '';
  disabled: boolean = false;
  renderInput: boolean = true;

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  onChange = (value: any) => { };
  onTouched = () => { };

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

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;

    if (this.type === 'file') {
      if (!target.files || target.files.length === 0) return;

      const files = Array.from(target.files);

      const result = this.multiple ? files : [files[0]];

      this.onChange(result);
      this.onTouched();

      this.fileChange.emit(event);

      // target.value = '';
      return;
    }

    this.value = target.value;
    this.onChange(this.value);

    this.valueChange.emit(this.value);
  }

  openFileDialog() {
    this.nativeInput?.nativeElement.click();
  }

  resetFileInput() {
    if (this.nativeInput?.nativeElement) {
      this.nativeInput.nativeElement.value = '';
    }
    // this.renderInput = false;
    // setTimeout(() => this.renderInput = true);
  }

  // Funções utilitárias
  get control() {
    return this.ngControl?.control;
  }

  get invalid() {
    return this.control?.invalid && (this.control?.touched || this.control?.dirty);
  }

  get errorMessage() {
    return getValidationMessage(this.control?.errors ?? null);
  }
}
