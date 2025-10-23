import { Injectable } from '@angular/core';
import { Toast } from '../_models/toast.models';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ToastService {

  toasts: Toast[] = [];
  private idCounter = 0;

  toastUpdated = new Subject<Toast>();

  private nextId() {
    return ++this.idCounter;
  }

  show(message: string, type: Toast['type'] = 'info', duration = 3000, persistent = false, closeable = true): number {
    const id = this.nextId();
    const toast = { message, type, id, persistent, duration, closeable };
    this.toasts.push(toast);
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
    const updated = this.toasts.find(t => t.id === toastId);
    if (updated) {
      // emite o objeto atualizado
      this.toastUpdated.next({ ...updated });
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
