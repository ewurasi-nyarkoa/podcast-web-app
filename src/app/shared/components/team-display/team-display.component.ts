import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TeamService } from '../../../core/services/team/team.service';
import { TeamMember } from '../../../core/interfaces/team';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-team-display',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './team-display.component.html',
  styleUrl: './team-display.component.scss'
})
export class TeamDisplayComponent implements OnInit {
  @Input() limit?: number; // Optional limit for homepage
  @Input() showViewAllButton = false; // Show "View All" button
  @Input() title = 'Meet the Team'; // Customizable title
  @Input() enableCarousel = false; // Enable carousel mode

  private teamService = inject(TeamService);
  teamMembers$: Observable<TeamMember[]>;
  currentSlide = 0;
  itemsPerSlide = 3;
  allMembers: TeamMember[] = [];

  constructor() {
    this.teamMembers$ = this.teamService.getTeamMembers();
  }

  ngOnInit() {
    this.teamService.fetchTeamMembers();
    this.teamMembers$.subscribe(members => {
      this.allMembers = members;
    });
  }

  get displayedMembers$(): Observable<TeamMember[]> {
    return this.teamMembers$.pipe(
      map(members => this.limit ? members.slice(0, this.limit) : members)
    );
  }

  onImageError(event: any, member: TeamMember) {
    event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=200&background=1976d2&color=fff`;
  }

  get totalSlides(): number {
    return Math.ceil(this.allMembers.length / this.itemsPerSlide);
  }

  get canGoNext(): boolean {
    return this.currentSlide < this.totalSlides - 1;
  }

  get canGoPrev(): boolean {
    return this.currentSlide > 0;
  }

  get currentSlideMembers(): TeamMember[] {
    if (!this.enableCarousel) {
      return this.limit ? this.allMembers.slice(0, this.limit) : this.allMembers;
    }
    const start = this.currentSlide * this.itemsPerSlide;
    const end = start + this.itemsPerSlide;
    return this.allMembers.slice(start, end);
  }

  nextSlide() {
    if (this.canGoNext) {
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.canGoPrev) {
      this.currentSlide--;
    }
  }
}