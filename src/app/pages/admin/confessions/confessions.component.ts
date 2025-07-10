import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ConfessionService } from '../../../core/services/confessions/confession.service';
import { confession } from '../../../core/interfaces/confessions';
import { Observable, map } from 'rxjs';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';


@Component({
  selector: 'app-confessions',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './confessions.component.html',
  styleUrl: './confessions.component.scss'
})
export class ConfessionsComponent implements OnInit {
  private confessionService = inject(ConfessionService);
  
  confessions$: Observable<confession[]>;
  selectedConfession: confession | null = null;
  searchTerm = '';
  filterStatus = 'all';
  currentPage = 1;
  itemsPerPage = 3;
  sortField: keyof confession = 'created_at';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  constructor() {
    this.confessions$ = this.confessionService.getConfessions();
  }

  ngOnInit() {
    // Only fetch if no confessions exist
    this.confessions$.subscribe(confessions => {
      if (!confessions || confessions.length === 0) {
        this.confessionService.fetchConfessions();
      }
    });
  }

  get filteredConfessions(): Observable<confession[]> {
    return this.confessions$.pipe(
      map((confessions: confession[]) => {
        if (!confessions) return [];
        
        return confessions
          .filter((confession: confession) => {
            const matchesSearch = confession.message.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesStatus = this.filterStatus === 'all' || 
              (this.filterStatus === 'approved' && confession.is_approved) ||
              (this.filterStatus === 'pending' && !confession.is_approved);
            return matchesSearch && matchesStatus;
          })
          .sort((a: confession, b: confession) => {
            const aValue = a[this.sortField];
            const bValue = b[this.sortField];
            const modifier = this.sortDirection === 'asc' ? 1 : -1;
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return aValue.localeCompare(bValue) * modifier;
            }
            return 0;
          });
      })
    );
  }

  get paginatedConfessions(): Observable<confession[]> {
    return this.filteredConfessions.pipe(
      map((confessions: confession[]) => {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return confessions.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }

  get totalPages(): Observable<number> {
    return this.filteredConfessions.pipe(
      map((confessions: confession[]) => Math.ceil(confessions.length / this.itemsPerPage))
    );
  }

  get hasNextPage(): Observable<boolean> {
    return this.totalPages.pipe(
      map(total => this.currentPage < total)
    );
  }

  handleSort(field: keyof confession) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  viewConfession(confession: confession) {
    this.selectedConfession = confession;
  }

  closeModal() {
    this.selectedConfession = null;
  }

  approveConfession(confession: confession) {
    this.confessionService.updateConfessionStatus(confession.id, true).subscribe({
      next: () => {
        console.log('Confession approved successfully');
      },
      error: (error) => {
        console.error('Failed to approve confession:', error);
      }
    });
  }

  deleteConfession(confession: confession) {
    if (confirm('Are you sure you want to delete this confession?')) {
      this.confessionService.deleteConfession(confession.id).subscribe({
        next: () => {
          console.log('Confession deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete confession:', error);
        }
      });
    }
  }

  getStatusColor(isApproved: boolean): string {
    return isApproved ? 'primary' : 'warn';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
