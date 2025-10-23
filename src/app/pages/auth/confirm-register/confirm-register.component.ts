import { Component } from '@angular/core';
import { PasswordFormComponent } from "../_components/password-form/password-form.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { FormControl, FormGroup } from '@angular/forms';
import { ResetPasswordService } from '../_services/reset-password.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { ToastService } from '../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-confirm-register',
  imports: [PasswordFormComponent, ButtonComponent],
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.css',
  standalone: true
})
export class ConfirmRegisterComponent {
  token: string | null = null;
  disableForm: boolean = false;
  constructor(private resetPasswordService: ResetPasswordService, private router: Router, private route: ActivatedRoute, private toast: ToastService){
    this.disableForm = false;
  }

  ngOnInit(){
    this.route.queryParams.subscribe((params: Params) => {
      this.token = params['token'];
    });
  }

  handleRegister(form: FormGroup){
    if(this.token === null || this.token === undefined || this.token === ''){
      this.toast.warning("Token inexistente!");
      return;
    }

    if (!form.valid) {
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }

    this.disableForm = true;

    form.addControl('token', new FormControl(this.token));

    const toastId = this.toast.show({message: "Confirmando registro, aguarde...", type:'loading', duration: 0, persistent: true, closeable: false});

    this.resetPasswordService.resetPassword(form.value).subscribe({
      next: (response: any) => {
        form.reset();
        this.toast.finishToast(toastId, {message: `${response.message} Dentro de alguns segundos você será redirecionado ao login.`, type: 'success', duration: 5000, closeable: true, persistent: false});
        setTimeout(()=>{
          this.disableForm = false;
          this.router.navigate(['/auth/login']);
        }, 5000);
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, {message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false});
        this.disableForm = false;
      }
    });
  }

}
