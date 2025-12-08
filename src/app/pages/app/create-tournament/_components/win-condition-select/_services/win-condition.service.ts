import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WinConditionService {

  private readonly url = `${environment.url}/TournamentWinConditions`;

  constructor(private http: HttpClient) { }

  getWinConditions(){
    return this.http.get(`${this.url}`);
  }
}
