import { Component } from '@angular/core';
import { PasswordInputComponent } from "../../../../shared/components/password-input/password-input.component";

@Component({
  selector: 'app-password-form',
  imports: [PasswordInputComponent],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.css',
  standalone: true
})
export class PasswordFormComponent {

}
