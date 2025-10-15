import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private url = `${environment.url}/ResetPasswords`;

  constructor(private http: HttpClient) { }

  sendPasswordEmailRequest(credentials: any){
    return this.http.post(`${this.url}/request-recover-password`, credentials);
  }
}
