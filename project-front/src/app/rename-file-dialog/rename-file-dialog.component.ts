import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-file-dialog',
  templateUrl: './rename-file-dialog.component.html',
})
export class RenameFileDialogComponent {
  newFilename: string = '';

  constructor(public dialogRef: MatDialogRef<RenameFileDialogComponent>) {}

  onRename(): void {
    this.dialogRef.close(this.newFilename);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}