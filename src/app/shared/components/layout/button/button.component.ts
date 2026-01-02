import { Component, Input } from '@angular/core';
import { BUTTON } from '../../../../theme/colors';
import { Variant } from '../../../models/variants.models';
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: true
})
export class ButtonComponent {
  @Input() type: "button" | "reset" | "submit" = "button";
  @Input() variant: Variant = "primary";
  @Input() disabled: boolean = false;
  @Input() keepColorOnDisable: boolean = false;
  constructor(){

  }

  getButtonClass(){
    
    return `${BUTTON.default[this.variant]} pr-5 pl-5 p-2 rounded-[0.5rem] cursor-pointer ${this.keepColorOnDisable ? '' : 'disabled:bg-gray-300 disabled:text-gray-500'} disabled:cursor-not-allowed`;
  }
}