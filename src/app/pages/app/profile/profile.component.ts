import { Component, input, ViewChild } from '@angular/core';
import { RowComponent } from "../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../shared/components/layout/col/col.component";
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";
import { ProfileService } from './_services/profile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { handleErrorMessages } from '../../../shared/utils/api-error-messages';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { SwalComponent, SwalPortalTargets, SwalPortalDirective, SwalDirective } from "@sweetalert2/ngx-sweetalert2";
import { AuthService } from '../../../shared/services/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  imports: [ImageCropperComponent, ReactiveFormsModule, RowComponent, ColComponent, InputComponent, ButtonComponent, SwalComponent, SwalPortalDirective, SwalDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: true
})
export class ProfileComponent {
  @ViewChild('cropperSwal') swal!: SwalComponent;
  @ViewChild('fileInput') fileInput!: InputComponent;

  MAX_FILE_SIZE = 3 * 1024 * 1024;
  data: any = {};
  formData!: FormGroup;
  disableForm: boolean = false;
  //Profile Photo
  profileImage: string | null = null;
  selectedFile: File | null = null;
  defaultImg = "profile/default.png";

  //Image Cropper
  imageChangedEvent: any = '';
  croppedImage: string | null = null;

  constructor(private router: Router, private profileService: ProfileService, private authService: AuthService, private toast: ToastService, private fb: FormBuilder, public readonly swalTargets: SwalPortalTargets) {
    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }]
    })
  }

  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    const toastId = this.toast.show({ message: "Carregando dados, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

    this.profileService.getUserData().subscribe({
      next: (response: any) => {
        this.data = response.data;
        this.formData.get('name')?.setValue(this.data.name);
        this.formData.get('email')?.setValue(this.data.email);
        this.profileImage = this.data.photoPath;
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false });
      },
      error: (err: any) => this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false })
    });
  }

  handleUpdateUserData() {
    if (!this.formData.valid) {
      this.toast.warning("Por favor, preencha os campos corretamente!");
      return;
    }

    this.disableForm = true;
    const toastId = this.toast.show({ message: "Atualizando dados, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

    this.profileService.updateUserData(this.formData.value).subscribe({
      next: (response: any) => {
        this.disableForm = false;
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false });
      },
      error: (err: any) => {
        this.disableForm = false;
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false });
      }
    })
  }

  handleDeactivateAccount() {
    const toastId = this.toast.show({ message: "Desativando conta, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

    this.profileService.updateUserData({ isActive: false }).pipe(
      switchMap(() => this.authService.logout()),
      catchError(err => {
        return throwError(() => err);
      })
    ).subscribe({
      next: (response: any) => {
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false });
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false });
      }
    })
  }

  handleDeleteAccount() {
    const toastId = this.toast.show({ message: "Excluindo conta, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });

    this.profileService.updateUserData({ isDeleted: true }).pipe(
      switchMap(() => this.authService.logout()),
      catchError(err => {
        return throwError(() => err);
      })
    ).subscribe({
      next: (response: any) => {
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false });
      },
      error: (err: any) => {
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false });
      }
    })
  }

  handleGlobalLogout() {
    return this.authService.globalLogout().subscribe({
      error: (err: any) => {
        this.authService.removeAccessToken();
      }
    });
  }

  //Update Profile Photo
  onFileSelected(files: File[]) {

    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > this.MAX_FILE_SIZE) {
        this.toast.error("A imagem deve ter no máximo 3MB");
        return;
      }

      this.selectedFile = file;
    }
  }

  updateProfilePicture() {

    const toastId = this.toast.show({ message: "Atualizando dados, aguarde...", type: "loading", duration: 0, persistent: true, closeable: false });
    this.profileService.updateProfilePhoto(this.selectedFile).subscribe({
      next: (response: any) => {
        this.selectedFile = null;
        this.imageChangedEvent = null;
        this.croppedImage = null;
        this.profileImage = response.data.profileUrl;
        this.fileInput.resetFileInput();
        this.toast.finishToast(toastId, { message: `${response.message}`, type: 'success', duration: 500, closeable: true, persistent: false });
      },
      error: (err: any) => {
        this.fileInput.resetFileInput();
        this.toast.finishToast(toastId, { message: handleErrorMessages(err), type: 'warning', duration: 5000, closeable: true, persistent: false });
      }
    });
  }

  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.size > this.MAX_FILE_SIZE) {
      this.toast.error("A imagem deve ter no máximo 3MB");
      return;
    }

    this.imageChangedEvent = event;
    this.open();
  }

  imageCropped(event: ImageCroppedEvent) {

    if (!event.blob) return;

    this.selectedFile = new File([event.blob], 'profile.png', { type: event.blob.type })
    this.croppedImage = event.base64!;

    this.croppedImage = URL.createObjectURL(event.blob);
  }

  open() {
    if (!this.swal) return;

    this.swal.fire().then(result => {
      if (!result.isConfirmed) {
        this.croppedImage = null;
        this.selectedFile = null;
        this.imageChangedEvent = null;
        this.fileInput.resetFileInput();
        return;
      };

      this.updateProfilePicture();
    });
  }

  onSwalOpen = () => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }
}
