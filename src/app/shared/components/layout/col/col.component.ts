import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-col',
  templateUrl: './col.component.html',
  styleUrl: './col.component.css',
  standalone: true
})
export class ColComponent {
  @Input() sm: 1 | 2 | 3 | 4 | 6 | 12 | "1" | "2" | "3" | "4" | "6" | "12" | null = 12;
  @Input() md: 1 | 2 | 3 | 4 | 6 | 12 | "1" | "2" | "3" | "4" | "6" | "12" | null= null;
  @Input() lg: 1 | 2 | 3 | 4 | 6 | 12 | "1" | "2" | "3" | "4" | "6" | "12" | null= null;
  @Input() xl: 1 | 2 | 3 | 4 | 6 | 12 | "1" | "2" | "3" | "4" | "6" | "12" | null= null;
  @Input() xxl: 1 | 2 | 3 | 4 | 6 | 12 | "1" | "2" | "3" | "4" | "6" | "12" | null= null;

  private widthMap: Record<number | string, string> = {
    "1": 'w-1/12',
    "2": 'w-1/6',
    "3": 'w-1/4',
    "4": 'w-1/3',
    "6": 'w-1/2',
    "12": 'w-full'
  }

  convert(value: number | string): string{
    return this.widthMap[value] || 'w-full';
  }

  get classes(){
    let classes = ['p-1', 'w-full'];
    if(this.sm !== null) classes.push(`sm:${this.convert(this.sm)}`);
    if(this.md !== null) classes.push(`md:${this.convert(this.md)}`);
    if(this.lg !== null) classes.push(`lg:${this.convert(this.lg)}`);
    if(this.xl !== null) classes.push(`xl:${this.convert(this.xl)}`);
    if(this.xxl !== null) classes.push(`2xl:${this.convert(this.xxl)}`);
    return classes.join(' ');
  }

  @HostBinding('class') get hostClasses(): string {
    return this.classes;
  }
}
