import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, finalize, firstValueFrom, map, of, take, tap, throwError } from 'rxjs';
import { UserStore } from '../../stores/user-store/user-store';
import { User } from '../../models/user.models';
import { ApiResponse } from '../../dtos/api-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly KEY = "token"
  private readonly url = `${environment.url}/Auth`;
  private readonly userUrl = `${environment.url}/Users`;
  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router, private userStore: UserStore) { }

  getAcessToken() {
    return localStorage.getItem(this.KEY);
  }

  setAccessToken(token: string) {
    localStorage.setItem(this.KEY, token);
  }

  removeAccessToken() {
    localStorage.removeItem(this.KEY);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getAcessToken();

    return !token ? false : true
  }

  async loadUser(): Promise<void>{
    try{
      const user = await firstValueFrom(
        this.http.get<ApiResponse<User>>(`${this.userUrl}/me`, { withCredentials: true})
      );

      const userData = user.data;

      this.userStore.setUser(userData);
    }catch{
      this.userStore.reset();
    }
  }

  logout() {
    return this.http.post(`${this.url}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.removeAccessToken();
      })
    );
  }

  globalLogout() {
    return this.http.post(`${this.url}/global-logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.removeAccessToken();
      })
    );
  }

  refreshToken() {
    if (this.refreshInProgress) {
      return this.refreshSubject.pipe(filter(token => token !== null), take(1), map(token => token as string));
    }

    this.refreshInProgress = true;
    this.refreshSubject.next(null);

    return this.http.post(`${this.url}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          const token = res?.data ?? null;
          this.setAccessToken(token);
          this.refreshSubject.next(token);
        }),
        map(res => res?.data ?? null),
        catchError((error) => {
          this.refreshSubject.next(null);
          return throwError(() => error);
        }),
        finalize(() => {
          this.refreshInProgress = false;
        })
      )
  }


}
