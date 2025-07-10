import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TeamMember, CreateTeamMemberRequest } from '../../../../core/interfaces/team';

@Component({
  selector: 'app-team-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './team-member-dialog.component.html',
  styleUrl: './team-member-dialog.component.scss'
})
export class TeamMemberDialogComponent {
  form: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamMember | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      role: [data?.role || '', Validators.required],
      image: [data?.profile_image || '', Validators.required],
      bio: [data?.bio || '', Validators.required],
      facebook: [this.getSocialLink(data?.social_media_links, 'Facebook') || ''],
      twitter: [this.getSocialLink(data?.social_media_links, 'Twitter') || ''],
      instagram: [this.getSocialLink(data?.social_media_links, 'Instagram') || ''],
      linkedin: [this.getSocialLink(data?.social_media_links, 'LinkedIn') || ''],
      youtube: [this.getSocialLink(data?.social_media_links, 'YouTube') || '']
    });
  }

  submit() {
    if (this.form.valid) {
      const value = this.form.value;
      const socialMediaLinks = [];
      if (value.facebook) socialMediaLinks.push({ platform: 'Facebook', url: value.facebook });
      if (value.twitter) socialMediaLinks.push({ platform: 'Twitter', url: value.twitter });
      if (value.instagram) socialMediaLinks.push({ platform: 'Instagram', url: value.instagram });
      if (value.linkedin) socialMediaLinks.push({ platform: 'LinkedIn', url: value.linkedin });
      if (value.youtube) socialMediaLinks.push({ platform: 'YouTube', url: value.youtube });

      const payload: CreateTeamMemberRequest = {
        name: value.name,
        role: value.role,
        profile_image: value.image,
        bio: value.bio,
        social_media_links: socialMediaLinks
      };
      this.dialogRef.close(payload);
    }
  }

  close() {
    this.dialogRef.close();
  }

  private getSocialLink(socialLinks: any[] | undefined, platform: string): string {
    if (!socialLinks) return '';
    const link = socialLinks.find(link => link.platform === platform);
    return link ? link.url : '';
  }

  onImageError(event: any) {
    console.error('Image failed to load:', event.target.src);
    event.target.style.display = 'none';
  }

  onImageLoad(event: any) {
    console.log('Image loaded successfully:', event.target.src);
    event.target.style.display = 'block';
  }
}
