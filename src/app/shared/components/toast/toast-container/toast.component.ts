import { Component, HostListener, Input } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { ToastItemComponent } from "../toast-item/toast-item.component";

@Component({
  selector: 'app-toast',
  imports: [ToastItemComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  standalone: true
})
export class ToastComponent {
  constructor(public toastService: ToastService){}
}
