import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-item',
  imports: [],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.css'
})
export class DropdownItemComponent {
  @Input() label!: string;

}
