import { Component, Input } from '@angular/core';
import { DropdownItemDirective } from "./_directive/dropdown-item.directive";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dropdown-item',
  imports: [DropdownItemDirective],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.css',
  standalone: true
})
export class DropdownItemComponent {
  @Input() label!: string;
}
