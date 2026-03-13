import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeploymentLog } from '../../models/deployment-log';

@Injectable({ providedIn: 'root' })
export class DeploymentLogService {
  private apiUrl = 'http://localhost:8080/api/deployment-logs';

  constructor(private http: HttpClient) {}

  getLogsForApplication(applicationId: number): Observable<DeploymentLog[]> {
    return this.http.get<DeploymentLog[]>(`${this.apiUrl}/applications/${applicationId}`);
  }
}