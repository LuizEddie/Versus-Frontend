import { Component } from '@angular/core';
import { PasswordFormComponent } from "../_components/password-form/password-form.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { FormGroup } from '@angular/forms';
import { ResetPasswordService } from '../_services/reset-password.service';

@Component({
  selector: 'app-confirm-register',
  imports: [PasswordFormComponent, ButtonComponent],
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.css',
  standalone: true
})
export class ConfirmRegisterComponent {

  constructor(private resetPasswordService: ResetPasswordService){}

  handleRegister(form: FormGroup){
    form.addControl('token', '');
    console.log(form.value);
  }

}
