import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfessionService } from '../../core/services/confessions/confession.service';

@Component({
  selector: 'app-confessions',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confessions.component.html',
  styleUrl: './confessions.component.scss'
})
export class ConfessionsComponent {
  private fb = inject(FormBuilder);
  private confessionService = inject(ConfessionService);
  private snackBar = inject(MatSnackBar);

  confessionForm: FormGroup;
  isLoading = false;

  categories = [
    { value: 'love', label: 'Love & Relationships' },
    { value: 'work', label: 'Work & Career' },
    { value: 'family', label: 'Family' },
    { value: 'friendship', label: 'Friendship' },
    { value: 'personal', label: 'Personal Growth' },
    { value: 'other', label: 'Other' }
  ];

  emotions = [
    { value: 'happy', label: '😊 Happy' },
    { value: 'sad', label: '😢 Sad' },
    { value: 'angry', label: '😠 Angry' },
    { value: 'confused', label: '😕 Confused' },
    { value: 'excited', label: '🤩 Excited' },
    { value: 'nervous', label: '😰 Nervous' },
    { value: 'grateful', label: '🙏 Grateful' },
    { value: 'regretful', label: '😔 Regretful' }
  ];

  constructor() {
    this.confessionForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      category: ['', Validators.required],
      emotion: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.confessionForm.valid) {
      this.isLoading = true;
      this.confessionService.submitConfession(this.confessionForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Your confession has been submitted successfully! It will be reviewed before being published.', 'Close', {
            duration: 6000,
            panelClass: ['success-snackbar']
          });
          this.confessionForm.reset();
        },
        error: (error) => {
          this.snackBar.open('Failed to submit confession. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  getCharacterCount(): number {
    return this.confessionForm.get('message')?.value?.length || 0;
  }
}
