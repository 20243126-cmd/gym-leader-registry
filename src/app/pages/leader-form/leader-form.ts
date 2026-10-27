
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GymLeader, GymLeaderService } from '../../services/gym-leader';

@Component({
  selector: 'app-leader-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css'
})
export class LeaderForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gymService = inject(GymLeaderService);

  isSaving = signal(false);
  isEditing = signal(false);
  errorMessage = signal('');
  pageTitle = signal('Register a Gym Leader');

  private leaderId: string | null = null;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['Kanto' as 'Kanto' | 'Johto' | 'Hoenn', Validators.required],
    town: ['', Validators.required],
    badge: ['', Validators.required],
    specialty: ['', Validators.required],
    aceLevel: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    motto: ['', Validators.maxLength(150)]
  });

  ngOnInit(): void {
    this.leaderId = this.route.snapshot.paramMap.get('id');

    if (this.leaderId) {
      this.isEditing.set(true);
      this.pageTitle.set('Edit Gym Leader');

      this.gymService.getLeader(this.leaderId).subscribe({
        next: leader => this.form.patchValue({
          name: leader.name,
          region: leader.region,
          town: leader.town,
          badge: leader.badge,
          specialty: leader.specialty,
          aceLevel: leader.aceLevel,
          motto: leader.motto || ''
        }),
        error: error => this.errorMessage.set(
          error.error?.message || 'Unable to load Gym Leader.'
        )
      });
    }
  }

  submitForm(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Please complete all required fields correctly.');
      return;
    }

    const value = this.form.getRawValue();

    const leader: GymLeader = {
      name: value.name.trim(),
      region: value.region,
      town: value.town.trim(),
      badge: value.badge.trim(),
      specialty: value.specialty.trim(),
      aceLevel: Number(value.aceLevel),
      motto: value.motto.trim()
    };

    this.isSaving.set(true);

    const request = this.leaderId
      ? this.gymService.updateLeader(this.leaderId, leader)
      : this.gymService.addLeader(leader);

    request.subscribe({
      next: () => {
        this.gymService.loadLeaders();
        this.router.navigate(['/leaders']);
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message || 'Unable to save Gym Leader. Please try again.'
        );
        this.isSaving.set(false);
      }
    });
  }
}
