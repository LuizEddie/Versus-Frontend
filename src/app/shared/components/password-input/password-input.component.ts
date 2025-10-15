import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputGroupComponent } from "../input-group/input-group.component";

@Component({
  selector: 'app-password-input',
  imports: [InputGroupComponent],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css'
})
export class PasswordInputComponent {
  @Input() label: string = 'Senha';
  @Input() id: string = 'password';
  @Input() name: string = 'password';
  @Input() placeholder: string = 'Digite a sua senha';
  
  @Input() model: any = null;
  @Output() modelChange = new EventEmitter<any>();


  type: string = 'password';

  constructor() {
    this.type = 'password';
  }

  changePasswordInput() {
    this.type = this.type === 'text' ? 'password' : 'text';
  }
}
