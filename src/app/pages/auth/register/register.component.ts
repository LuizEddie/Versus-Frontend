import { Component } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { Router } from '@angular/router';
import { LinkComponent } from "../../../shared/components/link/link.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { RegisterService } from './_services/register.service';

@Component({
  selector: 'app-register',
  imports: [InputComponent, ButtonComponent, LinkComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent {
  formData = new FormGroup({
    email: new FormControl({ value: '', disabled: false}, [Validators.required, Validators.email]),
    name: new FormControl({ value: '', disabled: false}, [Validators.required])
  });
  disableForm: boolean = false;
  constructor(private toast: ToastService, private registerService: RegisterService, private router: Router){
    this.disableForm = false;
  }

  handleRegister(){
    if(!this.formData.valid){
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }
    this.disableForm = true;
    const toastId = this.toast.show("Efetuando registro, aguarde...", 'loading', 0, true, false);

    this.registerService.register(this.formData.value).subscribe({
      next: (response: any) => {
        this.formData.reset();
        this.toast.finishToast(toastId, {message: `${response.message}. Dentro de 5 segundos você será redirecionado ao login.`, type: 'success', duration: 5000, closeable: true, persistent: false});
        setTimeout(()=>{
          this.disableForm = false;
          this.router.navigate(['/auth/login']);
        }, 5000);
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, {message: err?.error?.message || 'Ocorreu um erro inesperado!', type: 'warning', duration: 5000, closeable: true, persistent: false});
        this.disableForm = false;
      }
    })

  }
}
