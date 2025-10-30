import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly url = `${environment.url}/Auth`;

  constructor(private http: HttpClient) { }

  login(credentials: any){
    return this.http.post(`${this.url}/login`, credentials);
  }
}
