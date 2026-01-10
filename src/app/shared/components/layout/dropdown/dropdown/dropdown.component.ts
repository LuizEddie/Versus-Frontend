import { Component, Input, TemplateRef } from '@angular/core';
import { Variant } from '../../../../models/variants.models';
import { BUTTON } from '../../../../../theme/colors';
import { NgTemplateOutlet, NgClass } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  standalone: true
})
export class DropdownComponent {
  @Input() dropdownType: "button" | "template" = "button";
  @Input() label: string = 'Ações';
  @Input() type: "button" | "reset" | "submit" = "button";
  @Input() variant: Variant = "primary";
  @Input() disabled: boolean = false;
  @Input() align: "right" | "left" = "left";
  @Input() template!: TemplateRef<any>;
  isOpen: boolean = false;

  getButtonClass() {
    return `${BUTTON.default[this.variant]} pr-5 pl-5 p-2 rounded-[0.5rem] cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close(){
    this.isOpen = false;
  }

  getDropdownPositionClass(){
    return this.align === "right" ? "right-0" : "left-0";
  }
}
