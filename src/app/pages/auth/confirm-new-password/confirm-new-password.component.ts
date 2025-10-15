import { Component } from '@angular/core';
import { PasswordFormComponent } from "../_components/password-form/password-form.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-confirm-new-password',
  imports: [PasswordFormComponent, ButtonComponent],
  templateUrl: './confirm-new-password.component.html',
  styleUrl: './confirm-new-password.component.css',
  standalone: true
})
export class ConfirmNewPasswordComponent {

}
