import { Component } from '@angular/core';
import { RowComponent } from "../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../shared/components/layout/col/col.component";
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";
import { ProfileService } from './_services/profile.service';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RowComponent, ColComponent, InputComponent, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  data: any = {};
  formData!: FormGroup;
  disableForm: boolean = false;
  profileImage: string | null = null;
  selectedFile: File | null = null;
  defaultImg = 'https://localhost:7142/uploads/profile/default.png';

  constructor(private profileService: ProfileService, private toast: ToastService, private fb: FormBuilder) {
    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      email: [{ value: '', static: true }]
    })
  }

  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    this.profileService.getUserData().subscribe({
      next: (response: any) => {
        this.data = response.data;
        this.formData.get('name')?.setValue(this.data.name);
        this.formData.get('email')?.setValue(this.data.email);
        this.profileImage = this.data.photoPath;
      },
      error: (err: any) => this.toast.warning(handleErrorMessages(err))
    });
  }

  onFileSelected(files: File[]) {

    if (files && files.length > 0) {
      const file = files[0];

      this.selectedFile = file;

      const reader = new FileReader();

      reader.onload = () => this.profileImage = reader.result as string;

      reader.readAsDataURL(file);
    }
  }

  updateProfilePicture() {
    const toastId = this.toast.show({ message: "Removendo dados, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });
    this.profileService.updateProfilePhoto(this.selectedFile).subscribe({
      next: (response: any) => {
        this.selectedFile = null;
        this.profileImage = response.data.profileUrl;
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false });
      },
      error: (err: any) => {
        console.log(err);
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false });
      }
    });
  }
}
