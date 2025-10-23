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

  show(data: Partial<Omit<Toast, 'id'>>): number {
    const id = this.nextId();
    const toast = { 
      message: data?.message ?? '', 
      type: data?.type || 'info', 
      id, 
      persistent: data?.persistent ?? false, 
      duration: data?.duration ?? 3000, 
      closeable: data?.closeable ?? true 
    };
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
    this.show({message: msg, type: 'success'});
  }

  error(msg: string) {
    this.show({message: msg, type: 'error'});
  }

  info(msg: string) {
    this.show({message: msg});
  }

  warning(msg: string) {
    this.show({message: msg, type: 'warning'});
  }

}
