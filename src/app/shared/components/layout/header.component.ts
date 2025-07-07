import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeToggleComponent } from '../ui/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    ThemeToggleComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private scrollListener?: () => void;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.scrollListener = () => {
      const toolbar = this.elementRef.nativeElement.querySelector('.header-toolbar');
      if (window.scrollY > 50) {
        toolbar?.classList.add('scrolled');
      } else {
        toolbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}