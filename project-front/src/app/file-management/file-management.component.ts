import { Component } from '@angular/core';
import { FileService } from '../shared/services/file.service';
import { DialogService } from '../shared/services/dialog.service';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss']
})
export class FileManagementComponent {
  files: any[] = [];

  constructor(private fileService: FileService, private dialogService: DialogService) {}
  

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.getFiles().subscribe((data) => {
      console.log(data);
      this.files = data.files;
    });
  }

  onRemoveFile(fileId: number): void {
    this.dialogService.openConfirmationDialog().subscribe(result => {
      if (result) {
        this.fileService.removeFile(fileId).subscribe(
          response => {
            console.log('Fichier supprimé avec succès', response);
            this.loadFiles();
          },
          error => {
            console.error('Erreur lors de la suppression du fichier', error);
          }
        );
      }
    });
  }

  onRenameFile(fileId: number): void {
    this.dialogService.openRenameFileDialog().subscribe(newFilename => {
      if (newFilename) {
        this.fileService.renameFile(fileId, newFilename).subscribe(
          response => {
            console.log('Nom du fichier modifié avec succès', response);
            this.loadFiles();
          },
          error => {
            console.error('Erreur lors de la modification du nom du fichier', error);
          }
        );
      }
    });
  }

  downloadFile(fileId: number, filename: string): void {

    this.fileService.download(fileId).subscribe(
      (response) => {
        this.fileService.saveAsFile(response, filename);
      },
      (error) => {
        console.error('Erreur lors du téléchargement du fichier', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.fileService.uploadFile(file).subscribe(
        response => {
          console.log('Fichier téléchargé avec succès', response);
          this.loadFiles();
        },
        error => {
          console.error('Erreur lors du téléchargement du fichier', error);
        }
      );
    }
  }
}
