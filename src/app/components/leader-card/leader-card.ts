
import { Component, input, output } from '@angular/core';
import { GymLeader } from '../../services/gym-leader';

@Component({
  selector: 'app-leader-card',
  standalone: true,
  imports: [],
  templateUrl: './leader-card.html',
  styleUrl: './leader-card.css'
})
export class LeaderCard {
  leader = input.required<GymLeader>();

  edit = output<GymLeader>();
  remove = output<GymLeader>();
}
