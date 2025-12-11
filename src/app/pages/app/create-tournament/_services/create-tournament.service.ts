import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateTournamentService {

  private readonly url = `${environment.url}/Tournaments`;

  constructor(private http: HttpClient) { }

  createTournament(params: any){
    return this.http.post(`${this.url}`, params);
  }
}
