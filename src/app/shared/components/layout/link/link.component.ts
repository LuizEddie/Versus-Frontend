import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Variant } from '../../../models/variants.models';
import { LINK } from '../../../../theme/colors';

@Component({
  selector: 'app-link',
  imports: [RouterLink],
  templateUrl: './link.component.html',
  styleUrl: './link.component.css',
  standalone: true
})
export class LinkComponent {
  @Input() link: string = "#";
  @Input() variant: Variant = "primary";
  @Input() classNames: string = "";

  constructor(){

  }

  getLinkClass(){
    return `${this.classNames} ${LINK.default[this.variant]}`;
  }
}
