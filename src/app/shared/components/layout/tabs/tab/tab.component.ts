import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab',
  imports: [],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  standalone: true
})
export class TabComponent {
  @Input() label!: string;
  @Input() active = false;
  @ViewChild(TemplateRef, { static: true}) template!: TemplateRef<any>;
}
