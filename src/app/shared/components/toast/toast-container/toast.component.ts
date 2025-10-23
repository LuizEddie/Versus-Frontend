import { Component } from '@angular/core';
import { ToastItemComponent } from "../toast-item/toast-item.component";
import { ToastService } from '../../../services/toast/toast.service';

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
