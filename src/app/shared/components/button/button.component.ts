import { Component, Input } from '@angular/core';
import { BUTTON } from '../../../theme/colors';
import { Variant } from '../../models/variants.models';
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: true
})
export class ButtonComponent {
  @Input() type: "button" | "reset" | "submit" = "button";
  @Input() variant: Variant = "primary";

  constructor(){

  }

  getButtonClass(){
    return `${BUTTON.default[this.variant]} pr-5 pl-5 p-2 rounded-[0.5rem] cursor-pointer`;
  }
}