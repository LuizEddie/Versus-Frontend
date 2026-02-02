import { Component, inject } from '@angular/core';
import { ButtonComponent } from "../../shared/components/layout/button/button.component";
import { RouterLink } from "@angular/router";
import { UserStore } from '../../shared/stores/user-store/user-store';

@Component({
  selector: 'app-not-found',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  standalone: true
})
export class NotFoundComponent {
  store = inject(UserStore);

}
