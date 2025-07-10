import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Episode } from '../../../core/interfaces/episodes';

@Component({
  selector: 'app-add-playlist-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Playlist</h2>
    <mat-dialog-content>
      <form [formGroup]="playlistForm">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="title" placeholder="Enter playlist name">
          <mat-error *ngIf="playlistForm.get('title')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Enter playlist description" rows="3"></textarea>
          <mat-error *ngIf="playlistForm.get('description')?.hasError('required')">
            Description is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Select Episodes</mat-label>
          <mat-select formControlName="episodes" multiple>
            <mat-option *ngFor="let episode of data.allEpisodes" [value]="episode.id">
              {{ episode.title }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="playlistForm.get('episodes')?.hasError('required')">
            At least one episode is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="!playlistForm.valid">
        Create Playlist
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class AddPlaylistDialogComponent {
  playlistForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { allEpisodes: Episode[] }
  ) {
    this.playlistForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      episodes: [[], Validators.required]
    });
  }

  onCreate() {
    if (this.playlistForm.valid) {
      const formValue = this.playlistForm.value;
      this.dialogRef.close({
        title: formValue.title,
        description: formValue.description,
        episodeIds: formValue.episodes
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}