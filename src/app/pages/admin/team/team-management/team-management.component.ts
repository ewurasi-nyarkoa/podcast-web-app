import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TeamService } from '../../../../core/services/team/team.service';
import { TeamMember, CreateTeamMemberRequest } from '../../../../core/interfaces/team';
import { Observable } from 'rxjs';
import { TeamMemberDialogComponent } from '../team-member-dialog/team-member-dialog.component';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, TeamMemberDialogComponent],
  templateUrl: './team-management.component.html',
  styleUrl: './team-management.component.scss'
})
export class TeamManagementComponent {
  private teamService = inject(TeamService);
  private dialog = inject(MatDialog);

  teamMembers$: Observable<TeamMember[]> = this.teamService.getTeamMembers();

  constructor() {
    this.teamService.fetchTeamMembers();
    
    // Log all team member data for debugging
    this.teamMembers$.subscribe(members => {
      console.log('=== TEAM MEMBERS DATA ===');
      members.forEach((member, index) => {
        console.log(`Member ${index + 1}:`, {
          id: member.id,
          name: member.name,
          role: member.role,
          profile_image: member.profile_image,
          bio: member.bio,
          social_media_links: member.social_media_links
        });
        console.log(`Image URL for ${member.name}:`, member.profile_image);
      });
      console.log('=== END TEAM MEMBERS DATA ===');
    });
  }

  editMember(member: TeamMember) {
    const dialogRef = this.dialog.open(TeamMemberDialogComponent, {
      width: '400px',
      data: member
    });
    dialogRef.afterClosed().subscribe((result: CreateTeamMemberRequest | undefined) => {
      if (result) {
        this.teamService.updateTeamMember(member.id, result).subscribe();
      }
    });
  }

  deleteMember(member: TeamMember) {
    if (confirm(`Delete ${member.name}?`)) {
      this.teamService.deleteTeamMember(member.id).subscribe();
    }
  }

  addMember() {
    const dialogRef = this.dialog.open(TeamMemberDialogComponent, {
      width: '400px',
      data: null
    });
    dialogRef.afterClosed().subscribe((result: CreateTeamMemberRequest | undefined) => {
      if (result) {
        this.teamService.createTeamMember(result).subscribe();
      }
    });
  }

  onImageError(event: any, member: TeamMember) {
    console.error('Team member image failed to load:', member.name, event.target.src);
    // Use a more reliable placeholder service
    event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=88&background=1976d2&color=fff`;
  }

  onImageLoad(event: any, member: TeamMember) {
    console.log('Team member image loaded:', member.name, event.target.src);
  }
}
