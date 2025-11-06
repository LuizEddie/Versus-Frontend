import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly url = `${environment.url}/Tournaments`

  constructor(private http: HttpClient) { }

  getTournaments(){
    return this.http.get(`${this.url}`);   
  }
}
