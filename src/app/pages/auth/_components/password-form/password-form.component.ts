import { Component, EventEmitter, Output } from '@angular/core';
import { InputGroupComponent } from "../../../../shared/components/input-group/input-group.component";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-form',
  imports: [InputGroupComponent, ReactiveFormsModule],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.css',
  standalone: true
})
export class PasswordFormComponent {
  @Output() formSubmit = new EventEmitter<FormGroup>();

  formData: FormGroup = new FormGroup({
    password: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(8)]),
  },
  { validators: [PasswordFormComponent.passwordMatchValidator]}
);
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';

  onSubmit(){
    if(this.formData.valid){
      this.formSubmit.emit(this.formData);
    } else {
      this.formData.markAllAsTouched();
    }
  }

  changePasswordInput() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }

  changeConfirmPasswordInput() {
    this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
  }

  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null{
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if(!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true};
  }

}
