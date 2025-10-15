import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-group',
  imports: [FormsModule],
  templateUrl: './input-group.component.html',
  styleUrl: './input-group.component.css',
  standalone: true
})
export class InputGroupComponent {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() addonIcon: string = '';
  @Input() placeholder: string = '';
  @Input() iconOrText: string = 'text';
  @Input() addonText: string = '';
  @Input() beforeOrAfterInput: string = 'after';
  @Input() inputGroupAddonFunction?: () => void;

  @Input() model: any = null;
  @Output() modelChange = new EventEmitter<any>();
}
