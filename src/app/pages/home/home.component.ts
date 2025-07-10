import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamDisplayComponent } from '../../shared/components/team-display/team-display.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TeamDisplayComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}