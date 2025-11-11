import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { LinkComponent } from "../../shared/components/layout/link/link.component";

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, LinkComponent, RouterLinkWithHref],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {

}
