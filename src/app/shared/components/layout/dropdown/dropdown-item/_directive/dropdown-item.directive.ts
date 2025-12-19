import { Directive, HostListener } from '@angular/core';
import { DropdownComponent } from '../../dropdown/dropdown.component';

@Directive({
  selector: '[appDropdownItem]',
  standalone: true
})
export class DropdownItemDirective {

  constructor(private dropdown: DropdownComponent) { }

  @HostListener('click')
  onClick(){
    this.dropdown.close();
  }
}
