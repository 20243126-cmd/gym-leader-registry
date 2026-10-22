
import { Component, OnInit, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GymLeader, GymLeaderService } from './services/gym-leader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private fb = new FormBuilder();

  leadersService: GymLeaderService;
  editingId: string | null = null;
  searchTerm = signal('');
  selectedRegion = signal('All');
  message = signal('');
  errorMessage = signal('');
  isSaving = signal(false);

  filteredLeaders = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const region = this.selectedRegion();

    return this.leadersService.leaders().filter(leader => {
      const matchesSearch =
        leader.name.toLowerCase().includes(search) ||
        leader.town.toLowerCase().includes(search) ||
        leader.badge.toLowerCase().includes(search) ||
        leader.specialty.toLowerCase().includes(search);

      return matchesSearch &&
        (region === 'All' || leader.region === region);
    });
  });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['Kanto', Validators.required],
    town: ['', Validators.required],
    badge: ['', Validators.required],
    specialty: ['', Validators.required],
    aceLevel: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    motto: ['', Validators.maxLength(150)]
  });

  constructor(private gymService: GymLeaderService) {
    this.leadersService = gymService;
  }

  ngOnInit(): void {
    this.gymService.loadLeaders();
  }

  submitForm(): void {
    this.message.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Please complete all required fields correctly.');
      return;
    }

    const value = this.form.getRawValue();
    const leader: GymLeader = {
      name: value.name!.trim(),
      region: value.region as 'Kanto' | 'Johto' | 'Hoenn',
      town: value.town!.trim(),
      badge: value.badge!.trim(),
      specialty: value.specialty!.trim(),
      aceLevel: Number(value.aceLevel),
      motto: value.motto?.trim() || ''
    };

    this.isSaving.set(true);

    const request = this.editingId
      ? this.gymService.updateLeader(this.editingId, leader)
      : this.gymService.addLeader(leader);

    request.subscribe({
      next: () => {
        this.message.set(
          this.editingId
            ? 'Gym Leader updated successfully!'
            : 'Gym Leader added successfully!'
        );
        this.cancelEdit();
        this.gymService.loadLeaders();
        this.isSaving.set(false);
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message || 'Unable to save Gym Leader. Please try again.'
        );
        this.isSaving.set(false);
      }
    });
  }

  editLeader(leader: GymLeader): void {
    this.editingId = leader._id || null;
    this.message.set('');
    this.errorMessage.set('');

    this.form.patchValue({
      name: leader.name,
      region: leader.region,
      town: leader.town,
      badge: leader.badge,
      specialty: leader.specialty,
      aceLevel: leader.aceLevel,
      motto: leader.motto || ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteLeader(leader: GymLeader): void {
    if (!leader._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${leader.name}?`
    );

    if (!confirmed) return;

    this.message.set('');
    this.errorMessage.set('');

    this.gymService.deleteLeader(leader._id).subscribe({
      next: () => {
        this.message.set(`${leader.name} was deleted successfully.`);
        this.gymService.loadLeaders();

        if (this.editingId === leader._id) {
          this.cancelEdit();
        }
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message || 'Unable to delete Gym Leader.'
        );
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset({
      name: '',
      region: 'Kanto',
      town: '',
      badge: '',
      specialty: '',
      aceLevel: 1,
      motto: ''
    });
  }
}
