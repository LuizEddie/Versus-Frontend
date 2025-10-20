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

  finishToast(toastId:number, data: Partial<Omit<Toast, 'id'>>, duration = 3000){
    this.update(toastId, data);
    setTimeout(() => this.remove(toastId), duration);
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
