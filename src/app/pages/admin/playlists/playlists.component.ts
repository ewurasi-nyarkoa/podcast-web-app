import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PlaylistsService } from '../../../core/services/playlists/playlists.service';
import { EpisodesService } from '../../../core/services/episodes/episodes.service';
import { Playlist } from '../../../core/interfaces/playlist';
import { Episode } from '../../../core/interfaces/episodes';
import { AddEpisodesDialogComponent } from './add-episodes-dialog.component';
import { EditPlaylistDialogComponent } from './edit-playlist-dialog.component';
import { AddPlaylistDialogComponent } from './add-playlist-dialog.component';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  episodes: Episode[] = [];
  dataSource = new MatTableDataSource<Playlist>([]);
  displayedColumns: string[] = ['title', 'description', 'episodeCount', 'actions'];

  constructor(
    private playlistsService: PlaylistsService,
    private episodesService: EpisodesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPlaylists();
    this.loadEpisodes();
  }

  loadPlaylists() {
    console.log('Loading playlists...');
    this.playlistsService.getPlaylists().subscribe({
      next: (playlists) => {
        console.log('Playlists loaded:', playlists);
        this.playlists = playlists;
        this.dataSource.data = playlists;
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
        console.error('Full error object:', error);
      }
    });
  }

  loadEpisodes() {
    this.episodesService.getEpisodes(1).subscribe({
      next: (response) => this.episodes = response.data,
      error: (error) => console.error('Error loading episodes:', error)
    });
  }

  openAddPlaylistDialog() {
    const dialogRef = this.dialog.open(AddPlaylistDialogComponent, {
      width: '500px',
      data: { allEpisodes: this.episodes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playlistsService.createPlaylist(result).subscribe({
          next: () => this.loadPlaylists(),
          error: (error) => console.error('Error creating playlist:', error)
        });
      }
    });
  }

  editPlaylist(playlist: Playlist) {
    const dialogRef = this.dialog.open(EditPlaylistDialogComponent, {
      width: '500px',
      data: { playlist, allEpisodes: this.episodes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playlistsService.updatePlaylist(result).subscribe({
          next: () => this.loadPlaylists(),
          error: (error) => console.error('Error updating playlist:', error)
        });
      }
    });
  }

  deletePlaylist(id: number) {
    if (confirm('Are you sure you want to delete this playlist?')) {
      this.playlistsService.deletePlaylist(id).subscribe({
        next: () => this.loadPlaylists(),
        error: (error) => console.error('Error deleting playlist:', error)
      });
    }
  }



  getEpisodeCount(playlist: Playlist): number {
    return playlist.episodes?.length || 0;
  }

  openAddEpisodesDialog(playlist: Playlist) {
    const dialogRef = this.dialog.open(AddEpisodesDialogComponent, {
      width: '400px',
      data: { playlist, allEpisodes: this.episodes }
    });

    dialogRef.afterClosed().subscribe(episodeIds => {
      if (episodeIds && episodeIds.length > 0) {
        this.playlistsService.addEpisodesToPlaylist(playlist.id!, episodeIds).subscribe({
          next: () => this.loadPlaylists(),
          error: (error) => console.error('Error adding episodes:', error)
        });
      }
    });
  }
}