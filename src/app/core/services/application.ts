import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplicationRequest } from '../../models/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private apiUrl = 'http://localhost:8080/api/applications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  getByServerId(serverId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/server/${serverId}`);
  }

  create(app: ApplicationRequest): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, app);
  }

  update(id: number, app: ApplicationRequest): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${id}`, app);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}