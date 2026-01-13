import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p class="dialog-message">{{ data.message }}</p>
      @if (data.subMessage) {
        <p class="dialog-submessage">{{ data.subMessage }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false" class="cancel-btn">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true" class="confirm-btn">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      font-family: 'Playfair Display', 'Georgia', serif;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #f5f5f5;
    }

    mat-dialog-content {
      padding: 20px 24px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 15px;
      line-height: 1.6;
    }

    .dialog-message {
      margin: 0 0 12px 0;
    }

    .dialog-submessage {
      margin: 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      gap: 12px;
    }

    .cancel-btn {
      color: rgba(255, 255, 255, 0.8);
    }

    .confirm-btn {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}

