import { TestBed } from '@angular/core/testing';
import { GymLeader } from './gym-leader';

describe('GymLeader', () => {
  let service: GymLeader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GymLeader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
