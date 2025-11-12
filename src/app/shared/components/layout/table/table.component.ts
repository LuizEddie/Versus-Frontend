import { NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: true
})
export class TableComponent {
  @Input() columns: { key: string; label: string; template?: TemplateRef<any>}[] = [];
  @Input() data: any[] = [];
}
