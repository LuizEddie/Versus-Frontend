import { Component } from '@angular/core';
import { PasswordFormComponent } from "../../../shared/components/forms/password-form/password-form.component";
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";
import { ResetPasswordService } from '../_services/reset-password.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { FormControl, FormGroup } from '@angular/forms';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';

@Component({
  selector: 'app-confirm-new-password',
  imports: [PasswordFormComponent, ButtonComponent],
  templateUrl: './confirm-new-password.component.html',
  styleUrl: './confirm-new-password.component.css',
  standalone: true
})
export class ConfirmNewPasswordComponent {
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

  handleNewPassword(form: FormGroup){
    if(this.token === null || this.token === undefined || this.token === ''){
      this.toast.warning("Token inexistente!");
      return;
    }

    if(!form.valid){
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }

    this.disableForm = true;

    form.addControl('token', new FormControl(this.token));

    const toastId = this.toast.show({ message: "Confirmando sua nova senha, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false});

    this.resetPasswordService.resetPassword(form.value).subscribe({
      next: (response: any) => {
        form.reset();
        this.toast.finishToast(toastId, { message: `${response.message} Dentro de alguns segundos você será redirecionado ao login.`, type: 'success', duration: 5000, closeable: true, persistent: false});
        setTimeout(()=>{
          this.disableForm = false;
          this.router.navigate(['/auth/login']);
        }, 5000);
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false});
        this.disableForm = false;
      }
    });
  }

}
