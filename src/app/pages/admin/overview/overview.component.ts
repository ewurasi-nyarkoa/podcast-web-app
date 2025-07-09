import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ConfessionService } from '../../../core/services/confessions/confession.service';
import { confession } from '../../../core/interfaces/confessions';
import { Observable } from 'rxjs';

interface DashboardStats {
  totalEpisodes: number;
  totalConfessions: number;
  totalPlaylists: number;
  totalTeamMembers: number;
  monthlyDownloads: number;
  pendingConfessions: number;
}

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: number;
  publishedAt: string;
  status: string;
  thumbnail: string;
  audioUrl: string;
  downloads: number;
  category: string;
}

interface Confession {
  id: string;
  title: string;
  content: string;
  author: string;
  status: string;
  category: string;
  submittedAt: string;
  tags: string[];
}

@Component({
  selector: 'app-overview',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  private confessionService = inject(ConfessionService);
  
  confessions$: Observable<confession[]>;
  stats = {
    totalEpisodes: 156,
    totalConfessions: 0,
    monthlyDownloads: 45780,
    pendingConfessions: 0
  };

  recentConfessions: confession[] = [];

  constructor() {
    this.confessions$ = this.confessionService.getConfessions();
  }

  ngOnInit() {
    this.confessionService.fetchConfessions();
    
    this.confessions$.subscribe(confessions => {
      this.stats.totalConfessions = confessions.length;
      this.stats.pendingConfessions = confessions.filter(c => !c.is_approved).length;
      this.recentConfessions = confessions.slice(0, 2);
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  mockRecentEpisodes: Episode[] = [
    {
      id: '1',
      title: 'The Art of Storytelling in Audio',
      description: 'Exploring narrative techniques that captivate listeners',
      duration: 2850,
      publishedAt: '2024-01-15T10:00:00Z',
      status: 'published',
      thumbnail: 'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      audioUrl: '',
      downloads: 1250,
      category: 'Education'
    },
    {
      id: '2',
      title: 'Behind the Microphone: Producer Stories',
      description: 'Interviews with top podcast producers',
      duration: 3420,
      publishedAt: '2024-01-12T14:30:00Z',
      status: 'published',
      thumbnail: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      audioUrl: '',
      downloads: 980,
      category: 'Interview'
    },
    {
      id: '3',
      title: 'Listener Confessions: Most Shocking Stories',
      description: 'Compilation of the most surprising listener stories',
      duration: 2100,
      publishedAt: '2024-01-10T09:15:00Z',
      status: 'published',
      thumbnail: 'https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      audioUrl: '',
      downloads: 1890,
      category: 'Entertainment'
    }
  ];

  mockRecentConfessions: Confession[] = [
    {
      id: '1',
      title: 'I accidentally sent my boss a meme instead of a report',
      content: 'It was 3 AM and I was working late on a presentation...',
      author: 'Anonymous',
      status: 'pending',
      category: 'Work',
      submittedAt: '2024-01-15T15:30:00Z',
      tags: ['work', 'funny', 'mistake']
    },
    {
      id: '2',
      title: 'My secret talent nobody knows about',
      content: 'I can perfectly mimic any bird sound...',
      author: 'Anonymous',
      status: 'approved',
      category: 'Personal',
      submittedAt: '2024-01-15T12:45:00Z',
      tags: ['talent', 'secret', 'skills']
    },
    {
      id: '3',
      title: 'The time I met my favorite celebrity',
      content: 'I was at a coffee shop when I recognized...',
      author: 'Anonymous',
      status: 'approved',
      category: 'Celebrity',
      submittedAt: '2024-01-15T10:20:00Z',
      tags: ['celebrity', 'meeting', 'star-struck']
    }
  ];
}
