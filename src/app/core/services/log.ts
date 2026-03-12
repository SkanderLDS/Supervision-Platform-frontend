import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppLog, LogPage } from '../../models/log';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl = 'http://localhost:8080/api/logs';

  constructor(private http: HttpClient) {}

  collectLogs(serverId: number): Observable<AppLog[]> {
    return this.http.post<AppLog[]>(
      `${this.apiUrl}/servers/${serverId}/collect`, {});
  }

  getLatestLogs(serverId: number): Observable<AppLog[]> {
    return this.http.get<AppLog[]>(
      `${this.apiUrl}/servers/${serverId}/latest`);
  }

  searchLogs(
    serverId: number,
    level?: string,
    from?: string,
    to?: string,
    keyword?: string,
    applicationName?: string,
    page: number = 0,
    size: number = 20
  ): Observable<LogPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (level) params = params.set('level', level);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    if (keyword) params = params.set('keyword', keyword);
    if (applicationName) params = params.set('applicationName', applicationName);

    return this.http.get<LogPage>(
      `${this.apiUrl}/servers/${serverId}/search`, { params });
  }
}