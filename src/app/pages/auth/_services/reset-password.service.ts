import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private url = `${environment.url}/ResetPasswords`;

  constructor(private http: HttpClient) { }

  resetPassword(credentials: any){
    return this.http.post(`${this.url}/update-password`, credentials);
  }
}
