import { Component, HostListener, Input } from '@angular/core';
import { Toast } from '../_models/toast.models';
import { ToastService } from '../services/toast.service';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-item',
  imports: [NgClass],
  templateUrl: './toast-item.component.html',
  styleUrl: './toast-item.component.css',
  standalone: true
})
export class ToastItemComponent {
  @Input() toast!: Toast;
  private timeoutId: any;
  private remainingTime!: number;
  private startTime!: number; 
  private sub!: Subscription;

  constructor(public toastService: ToastService){
  }

  ngOnInit(){    
    if(!this.toast.persistent && (this.toast?.duration ?? 0) > 0) this.startTimer();

    this.sub = this.toastService.toastUpdated.subscribe((updToast) => {
      if(updToast.id === this.toast.id){

        this.toast = { ...updToast };

        if(this.timeoutId){
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        if(!this.toast.persistent && (this.toast?.duration ?? 0) > 0) this.startTimer();

      }
    });
  }

  ngOnDestroy(){
    clearTimeout(this.timeoutId);
    this.sub?.unsubscribe();
  }

  private startTimer(){

    const duration = Number(this.toast.duration ?? 3000);
    if(!duration || duration <= 0) return;

    this.startTime = Date.now();
    this.remainingTime = duration;

    if(this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => this.close(), this.remainingTime);
  }

  private pauseTimer(){
    if(!this.timeoutId) return;
    
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
    const elapsed = Date.now() - this.startTime;
    this.remainingTime = Math.max(0, this.remainingTime - elapsed);
  }

  private resumeTimer(){
    if(!this.remainingTime || this.remainingTime <= 0) return;
    this.startTime = Date.now();
    this.timeoutId = setTimeout(() => this.close(), this.remainingTime);
  }

  close(){
    if(this.toast.closeable) this.toastService.remove(this.toast.id);
  }

  @HostListener('mouseenter')
  onMouseEnter(){
    if(!this.toast.persistent) this.pauseTimer();
  }

  @HostListener('mouseleave')
  onMouseLeave(){
    if(!this.toast.persistent) this.resumeTimer();
  }
}
