import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Server, ServerRequest } from '../../models/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private apiUrl = 'http://localhost:8080/api/servers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Server[]> {
    return this.http.get<Server[]>(this.apiUrl);
  }

  getById(id: number): Observable<Server> {
    return this.http.get<Server>(`${this.apiUrl}/${id}`);
  }

  create(server: ServerRequest): Observable<Server> {
    return this.http.post<Server>(this.apiUrl, server);
  }

  update(id: number, server: ServerRequest): Observable<Server> {
    return this.http.put<Server>(`${this.apiUrl}/${id}`, server);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkSsh(id: number): Observable<{status: string}> {
    return this.http.post<{status: string}>(`${this.apiUrl}/${id}/check/ssh`, {});
  }

  checkGlobal(id: number): Observable<{status: string}> {
    return this.http.post<{status: string}>(`${this.apiUrl}/${id}/check/global`, {});
  }
}