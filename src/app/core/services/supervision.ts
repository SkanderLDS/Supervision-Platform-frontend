import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerMetrics } from '../../models/metrics';
import { Alert } from '../../models/alert';

@Injectable({
  providedIn: 'root'
})
export class SupervisionService {

  private apiUrl = 'http://localhost:8080/api/supervision';

  constructor(private http: HttpClient) {}

  superviseServer(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/servers/${id}`, {});
  }

  getLatestMetrics(id: number): Observable<ServerMetrics> {
    return this.http.get<ServerMetrics>(`${this.apiUrl}/servers/${id}/metrics`);
  }

  getMetricsHistory(id: number): Observable<ServerMetrics[]> {
    return this.http.get<ServerMetrics[]>(`${this.apiUrl}/servers/${id}/metrics/history`);
  }

  getAlerts(id: number): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/servers/${id}/alerts`);
  }

  getUnresolvedAlerts(id: number): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/servers/${id}/alerts/unresolved`);
  }

  resolveAlert(alertId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/alerts/${alertId}/resolve`, {});
  }
}