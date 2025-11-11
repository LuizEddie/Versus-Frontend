import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet]
})
export class TabsComponent {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  activeIndex = 0;

  ngAfterContentInit(){
    const active = this.tabs.toArray().findIndex(tab => tab.active);
    this.activeIndex = active !== -1 ? active : 0;
  }

  setActive(index: number){
    this.activeIndex = index;
    this.tabs.forEach((tab, i) => (tab.active = i === index));
  }
}
