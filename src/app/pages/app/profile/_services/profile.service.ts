import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly url = `${environment.url}/Users`;
  private readonly passwordUrl = `${environment.url}/ResetPasswords`;

  constructor(private http: HttpClient) { }

  getUserData(){
    return this.http.get(`${this.url}/me`);
  }

  updateUserData(params: any){
    return this.http.patch(`${this.url}/me/update-user-data`, params);
  }

  updateProfilePhoto(file: any){
    const formData = new FormData();
    formData.append('file', file);
    return this.http.patch(`${this.url}/me/update-profile-picture`, formData);
  }

  updatePassword(params: any){  
    return this.http.patch(`${this.passwordUrl}/me/update-password`, params);
  }
}
