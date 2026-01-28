import { computed, Injectable, signal } from '@angular/core';
import { User } from '../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly _user = signal<User | null>(null);
  private readonly _initialized = signal(false);

  readonly user = this._user.asReadonly();
  readonly initialized = this._initialized.asReadonly();

  readonly isLoggedIn = computed(() => !!this._user());

  setUser(user: User | null){
    this._user.set(user);
    this._initialized.set(true);
  }

  updateUser(partial: Partial<User>){
    this._user.update(user => user ? {...user, ...partial} : user);
  }

  reset(){
    this._user.set(null);
    this._initialized.set(true);
  }
}
