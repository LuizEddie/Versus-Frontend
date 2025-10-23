import { Component } from '@angular/core';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { InputComponent } from "../../../shared/components/input/input.component";
import { LinkComponent } from "../../../shared/components/link/link.component";
import { ForgotPasswordService } from './_services/forgot-password.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { Router } from '@angular/router';

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
  disableForm: boolean = false;
  constructor(private forgotPasswordService: ForgotPasswordService, private toast: ToastService, private router: Router){
    this.disableForm = false;
  }

  handleForgotPassword(){
    if(!this.formData.valid){
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }

    this.disableForm = true;

    const toastId = this.toast.show({message: "Enviando solicitação, aguarde...", type:'loading', duration: 0, persistent: true, closeable: false});
    
    this.forgotPasswordService.sendPasswordEmailRequest(this.formData.value).subscribe({
      next: (response: any) => {
        this.formData.reset();
        this.toast.finishToast(toastId, {message: `${response.message}\n Dentro de alguns segundos você será redirecionado ao login.`, type: 'success', duration: 5000, closeable: true, persistent: false});
        setTimeout(()=>{
          this.disableForm = false;
          this.router.navigate(['/auth/login']);
        }, 5000);
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, {message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false});
      }
    })
  }
}
