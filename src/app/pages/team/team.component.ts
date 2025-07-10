import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamDisplayComponent } from '../../shared/components/team-display/team-display.component';

@Component({
  selector: 'app-team',
  imports: [
    CommonModule,
    TeamDisplayComponent
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {

}