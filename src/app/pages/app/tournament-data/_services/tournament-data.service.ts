import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TournamentDataService {

  private readonly url = `${environment.url}/Tournaments`;
  private readonly playerUrl = `${environment.url}/Players`;
  private readonly specsUrl = `${environment.url}/TournamentSpecs`;

  constructor(private http: HttpClient) { }

  getTournamentById(id: string | null){
    return this.http.get(`${this.url}/${id}`);
  }

  deletePlayer(playerId: number | null){
    return this.http.delete(`${this.playerUrl}/${playerId}`);
  }

  updateTournamentSpec(id: number | null, specs: any){
    return this.http.patch(`${this.specsUrl}/${id}`, specs);
  }

  updateTournament(id: number | null, params: any){
    return this.http.patch(`${this.url}/${id}`, params);
  }

  updatePlayer(id: number | null, params: any){
    return this.http.put(`${this.playerUrl}/${id}`, params);
  }

  addPlayers(tournamentId: number | null, params: any){
    return this.http.post(`${this.playerUrl}/${tournamentId}`, params);
  }
}
