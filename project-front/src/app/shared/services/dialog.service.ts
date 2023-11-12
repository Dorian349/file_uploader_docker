import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RenameFileDialogComponent } from '../../pages/rename-file-dialog/rename-file-dialog.component';
import { ConfirmationDialogComponent } from '../../pages/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openRenameFileDialog(): Observable<any> {
    const dialogRef = this.dialog.open(RenameFileDialogComponent, {
      width: '250px',
    });

    return dialogRef.afterClosed();
  }

  openConfirmationDialog(): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });

    return dialogRef.afterClosed();
  }
}