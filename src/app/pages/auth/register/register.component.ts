import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { RouterLink } from '@angular/router';
import { LinkComponent } from "../../../shared/components/link/link.component";

@Component({
  selector: 'app-register',
  imports: [InputComponent, ButtonComponent, LinkComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}
