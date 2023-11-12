import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  download(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/file/download/${fileId}`, { responseType: 'blob' });
  }

  removeFile(fileId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/file/remove/${fileId}`);
  }

  renameFile(fileId: number, newFilename: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/file/rename/${fileId}`, { newFilename });
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();

    return this.http.post(`${this.apiUrl}/file/upload`, formData, { headers });
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/file/all`);
  }
}
