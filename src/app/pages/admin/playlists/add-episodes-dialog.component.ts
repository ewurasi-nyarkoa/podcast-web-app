import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Episode } from '../../../core/interfaces/episodes';
import { Playlist } from '../../../core/interfaces/playlist';

@Component({
  selector: 'app-add-episodes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Add Episodes to "{{ data.playlist.name }}"</h2>
    <mat-dialog-content>
      <form [formGroup]="episodesForm">
        <mat-form-field appearance="outline">
          <mat-label>Select Episodes to Add</mat-label>
          <mat-select formControlName="episodes" multiple>
            <mat-option *ngFor="let episode of availableEpisodes" [value]="episode.id">
              {{ episode.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onAdd()" [disabled]="!episodesForm.valid">
        Add Episodes
      </button>
    </mat-dialog-actions>
  `
})
export class AddEpisodesDialogComponent implements OnInit {
  episodesForm: FormGroup;
  availableEpisodes: Episode[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEpisodesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { playlist: Playlist; allEpisodes: Episode[] }
  ) {
    this.episodesForm = this.fb.group({
      episodes: [[], Validators.required]
    });
  }

  ngOnInit() {
    const playlistEpisodeIds = this.data.playlist.episodes.map(ep => ep.id);
    this.availableEpisodes = this.data.allEpisodes.filter(ep => !playlistEpisodeIds.includes(ep.id));
  }

  onAdd() {
    if (this.episodesForm.valid) {
      this.dialogRef.close(this.episodesForm.value.episodes);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}