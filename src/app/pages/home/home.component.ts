import { Component } from '@angular/core';
import { TabsComponent } from "../../shared/components/tabs/tabs-container/tabs.component";
import { TabComponent } from "../../shared/components/tabs/tab/tab.component";

@Component({
  selector: 'app-home',
  imports: [TabsComponent, TabComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

}
