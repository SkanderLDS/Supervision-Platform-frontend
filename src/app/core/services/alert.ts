import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertRule, AlertRuleRequest } from '../../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private apiUrl = 'http://localhost:8080/api/alert-rules';

  constructor(private http: HttpClient) {}

  getRulesForServer(serverId: number): Observable<AlertRule[]> {
    return this.http.get<AlertRule[]>(`${this.apiUrl}/servers/${serverId}`);
  }

  createRule(rule: AlertRuleRequest): Observable<AlertRule> {
    return this.http.post<AlertRule>(this.apiUrl, rule);
  }

  updateRule(id: number, rule: AlertRuleRequest): Observable<AlertRule> {
    return this.http.put<AlertRule>(`${this.apiUrl}/${id}`, rule);
  }

  deleteRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  enableRule(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/enable`, {});
  }

  disableRule(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/disable`, {});
  }

  evaluateRules(serverId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/servers/${serverId}/evaluate`, {});
  }
}