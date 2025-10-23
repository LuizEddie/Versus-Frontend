import { Component } from '@angular/core';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { InputComponent } from "../../../shared/components/input/input.component";
import { LinkComponent } from "../../../shared/components/link/link.component";
import { ForgotPasswordService } from './_services/forgot-password.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ButtonComponent, InputComponent, LinkComponent, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  formData = new FormGroup({
    email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email]),
  });

  constructor(private forgotPasswordService: ForgotPasswordService, private toast: ToastService){

  }

  handleForgotPassword(){
    const toastId = this.toast.show('Carregando...', 'loading', 0, true, false);
    
    this.forgotPasswordService.sendPasswordEmailRequest(this.formData).subscribe({
      next: (response: any) => {
        this.formData.reset();
        this.toast.finishToast(toastId, {message: response.message, type: 'success', duration: 5000, closeable: true, persistent: false});
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, {message: err?.error?.message || 'Ocorreu um erro inesperado!', type: 'warning', duration: 5000, closeable: true, persistent: false});
      }
    })
  }
}
