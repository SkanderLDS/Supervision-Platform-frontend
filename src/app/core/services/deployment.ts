import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationVersion } from '../../models/application';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {

  private apiUrl = 'http://localhost:8080/api/versions';
  private appUrl = 'http://localhost:8080/api/applications';

  constructor(private http: HttpClient) {}

  getVersions(applicationId: number): Observable<ApplicationVersion[]> {
    return this.http.get<ApplicationVersion[]>(
      `${this.appUrl}/${applicationId}/versions`);
  }

  createVersion(applicationId: number, version: string, type: string): Observable<ApplicationVersion> {
    return this.http.post<ApplicationVersion>(
      `${this.appUrl}/${applicationId}/versions?version=${version}&type=${type}`, {});
  }

  deploy(versionId: number, file: File): Observable<ApplicationVersion> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApplicationVersion>(
      `${this.apiUrl}/${versionId}/deploy`, formData);
  }

  redeploy(versionId: number, file: File): Observable<ApplicationVersion> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApplicationVersion>(
      `${this.apiUrl}/${versionId}/redeploy`, formData);
  }

  start(versionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${versionId}/start`, {});
  }

  stop(versionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${versionId}/stop`, {});
  }

  restart(versionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${versionId}/restart`, {});
  }
}