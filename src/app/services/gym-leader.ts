
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GymLeader {
  _id?: string;
  name: string;
  region: 'Kanto' | 'Johto' | 'Hoenn';
  town: string;
  badge: string;
  specialty: string;
  aceLevel: number;
  motto?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GymLeaderService {
  private readonly apiUrl = 'http://localhost:3000/api/leaders';

  readonly leaders = signal<GymLeader[]>([]);

  readonly totalLeaders = computed(() => this.leaders().length);

  readonly kantoCount = computed(
    () => this.leaders().filter(leader => leader.region === 'Kanto').length
  );

  readonly johtoCount = computed(
    () => this.leaders().filter(leader => leader.region === 'Johto').length
  );

  readonly hoennCount = computed(
    () => this.leaders().filter(leader => leader.region === 'Hoenn').length
  );

  constructor(private http: HttpClient) {}

  loadLeaders(): void {
    this.http.get<GymLeader[]>(this.apiUrl).subscribe({
      next: data => this.leaders.set(data),
      error: error => console.error('Failed to load Gym Leaders:', error)
    });
  }

  getLeader(id: string): Observable<GymLeader> {
    return this.http.get<GymLeader>(`${this.apiUrl}/${id}`);
  }

  addLeader(leader: GymLeader): Observable<GymLeader> {
    return this.http.post<GymLeader>(this.apiUrl, leader);
  }

  updateLeader(id: string, leader: GymLeader): Observable<GymLeader> {
    return this.http.put<GymLeader>(`${this.apiUrl}/${id}`, leader);
  }

  deleteLeader(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
