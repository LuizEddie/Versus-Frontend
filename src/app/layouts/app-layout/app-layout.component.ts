import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { LinkComponent } from "../../shared/components/layout/link/link.component";
import { DropdownComponent } from "../../shared/components/layout/dropdown/dropdown/dropdown.component";
import { DropdownItemComponent } from "../../shared/components/layout/dropdown/dropdown-item/dropdown-item.component";
import { SwalComponent, SwalDirective } from "@sweetalert2/ngx-sweetalert2";
import { AuthService } from '../../shared/services/auth/auth.service';
import { handleErrorMessages } from '../../shared/utils/api-error-messages';
import { UserStore } from '../../shared/stores/user-store/user-store';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, LinkComponent, RouterLinkWithHref, DropdownComponent, DropdownItemComponent, SwalComponent, SwalDirective],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {

  store = inject(UserStore);
  
  constructor(private authService: AuthService, private router: Router){

  }

  logout(){
    return this.authService.logout().subscribe({
      error: (err: any) => {
        this.authService.removeAccessToken();
      }
    });
  }
}
