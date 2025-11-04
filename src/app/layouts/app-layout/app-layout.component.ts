import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { LinkComponent } from "../../shared/components/link/link.component";

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, LinkComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {

}
