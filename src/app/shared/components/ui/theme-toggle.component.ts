import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  isDarkMode = signal(false);

  toggleTheme() {
    this.isDarkMode.update(current => !current);

    if (this.isDarkMode()) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    

    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  ngOnInit() {

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}