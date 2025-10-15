import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'loading';
  id: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  toasts: Toast[] = [];
  private idCounter = 0;

  private nextId() {
    return ++this.idCounter;
  }

  show(message: string, type: Toast['type'] = 'info', duration = 3000, persistent = false): number {
    const id = this.nextId();
    const toast = { message, type, id, persistent };
    this.toasts.push(toast);

    if (!persistent) {
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t !== toast);
      }, duration);
    }

    return id;
  }

  update(id: number, data: Partial<Omit<Toast, 'id'>>){
    const toast = this.toasts.find((t) => t.id === id);
    if(toast) Object.assign(toast, data);
  }

  remove(id: number){
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  finishToast(toastId:number, data: Partial<Omit<Toast, 'id'>>){
    this.update(toastId, data);
    setTimeout(() => this.remove(toastId), 3000);
  }

  async wrapRequest<T>(
    obs$: Observable<T>,
    messages: { loading: string, success: string, warning: string}
  ): Promise<T | void> {
    const toastId = this.show(messages.loading, 'loading', 0, true);

    try{
      const result = await firstValueFrom(obs$);
      this.update(toastId, { message: messages.success, type: 'success'});
      setTimeout(() => this.remove(toastId), 3000);
      return result;
    }catch(err){
      this.update(toastId, { message: messages.warning, type: 'warning'});
      setTimeout(() => this.remove(toastId), 3000);
    }
  }

  success(msg: string) {
    this.show(msg, 'success');
  }

  error(msg: string) {
    this.show(msg, 'error');
  }

  info(msg: string) {
    this.show(msg, 'info');
  }

  warning(msg: string) {
    this.show(msg, 'warning');
  }

}
