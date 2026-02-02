import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { LinkComponent } from "../../components/layout/link/link.component";
import { DropdownComponent } from "../../components/layout/dropdown/dropdown/dropdown.component";
import { DropdownItemComponent } from "../../components/layout/dropdown/dropdown-item/dropdown-item.component";
import { SwalComponent, SwalDirective } from "@sweetalert2/ngx-sweetalert2";
import { AuthService } from '../../services/auth/auth.service';
import { UserStore } from '../../stores/user-store/user-store';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, LinkComponent, RouterLinkWithHref, DropdownComponent, DropdownItemComponent, SwalComponent, SwalDirective],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {

  store = inject(UserStore);
  
  constructor(private authService: AuthService ){

  }

  logout(){
    return this.authService.logout().subscribe({
      error: (err: any) => {
        this.authService.removeAccessToken();
      }
    });
  }
}
