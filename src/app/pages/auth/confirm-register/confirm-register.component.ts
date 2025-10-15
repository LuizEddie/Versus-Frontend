import { Component } from '@angular/core';
import { PasswordFormComponent } from "../_components/password-form/password-form.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-confirm-register',
  imports: [PasswordFormComponent, ButtonComponent],
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.css',
  standalone: true
})
export class ConfirmRegisterComponent {

}
