import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
  standalone: true
})
export class AuthLayoutComponent {

  private authService = inject(AuthService);

  ngOnInit(){
    this.authService.logout().subscribe();
  }
}
