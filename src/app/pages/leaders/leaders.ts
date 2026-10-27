
import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GymLeader, GymLeaderService } from '../../services/gym-leader';
import { LeaderCard } from '../../components/leader-card/leader-card';

@Component({
  selector: 'app-leaders',
  standalone: true,
  imports: [LeaderCard, RouterLink],
  templateUrl: './leaders.html',
  styleUrl: './leaders.css'
})
export class Leaders implements OnInit {
  private router = inject(Router);
  gymService = inject(GymLeaderService);

  searchTerm = signal('');
  selectedRegion = signal('All');
  message = signal('');
  errorMessage = signal('');

  filteredLeaders = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const region = this.selectedRegion();

    return this.gymService.leaders().filter(leader => {
      const matchesSearch =
        leader.name.toLowerCase().includes(search) ||
        leader.town.toLowerCase().includes(search) ||
        leader.badge.toLowerCase().includes(search) ||
        leader.specialty.toLowerCase().includes(search);

      return matchesSearch &&
        (region === 'All' || leader.region === region);
    });
  });

  ngOnInit(): void {
    this.gymService.loadLeaders();
  }

  editLeader(leader: GymLeader): void {
    if (leader._id) {
      this.router.navigate(['/leaders', leader._id, 'edit']);
    }
  }

  deleteLeader(leader: GymLeader): void {
    if (!leader._id) return;

    if (!window.confirm(`Are you sure you want to delete ${leader.name}?`)) {
      return;
    }

    this.message.set('');
    this.errorMessage.set('');

    this.gymService.deleteLeader(leader._id).subscribe({
      next: () => {
        this.message.set(`${leader.name} was deleted successfully.`);
        this.gymService.loadLeaders();
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message || 'Unable to delete Gym Leader.'
        );
      }
    });
  }
}
