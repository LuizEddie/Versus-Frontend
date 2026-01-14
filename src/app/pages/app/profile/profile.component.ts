import { Component } from '@angular/core';
import { RowComponent } from "../../../shared/components/layout/row/row.component";
import { ColComponent } from "../../../shared/components/layout/col/col.component";
import { InputComponent } from "../../../shared/components/layout/input/input.component";
import { ButtonComponent } from "../../../shared/components/layout/button/button.component";

@Component({
  selector: 'app-profile',
  imports: [RowComponent, ColComponent, InputComponent, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  preview: string | null = null;
  defaultImg = 'https://wallpapers.com/images/featured/naruto-hd-p23c4c3xyjkcnp6r.jpg';

  onFileSelected(files: File[]){

    if(files && files.length > 0){
      const file = files[0];

      const reader = new FileReader();

      reader.onload = () => this.preview = reader.result as string;

      reader.readAsDataURL(file);
    }
  }
}
