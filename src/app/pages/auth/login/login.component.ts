import { Component } from '@angular/core';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { LinkComponent } from "../../../shared/components/link/link.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from './_services/login.service';
import { Router } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { InputGroupComponent } from '../../../shared/components/input-group/input-group.component';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, LinkComponent, ReactiveFormsModule, InputComponent, InputGroupComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})
export class LoginComponent {
  formData: FormGroup  = new FormGroup({
    email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
    password: new FormControl({ value: '', disabled: false }, [Validators.required])
  });
  passwordType: string = 'password'
  disableForm: boolean = false;

  constructor(private loginService: LoginService, private router: Router, private toast: ToastService, private authService: AuthService) { 
    this.disableForm = false;
  }

  changePasswordInput() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }

  handleLogin() {
    if (!this.formData.valid) {
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }
    this.disableForm = true;

    const toastId = this.toast.show({message: "Efetuando login, aguarde...", type:'loading', duration: 0, persistent: true, closeable: false});

    this.loginService.login(this.formData.value).subscribe({
      next: (response: any) =>{
        this.authService.setAccessToken(response.data);
        this.router.navigate(['/home']);
        this.formData.reset();
        this.toast.finishToast(toastId, {message: response.message, type: 'success', duration: 5000, closeable: true, persistent: false});
        this.disableForm = false;
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, {message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false});
        this.disableForm = false;
      }
    })
  }

}
