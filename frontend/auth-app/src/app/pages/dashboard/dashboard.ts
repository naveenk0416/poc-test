import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  isLoading = true;
  error = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (userData) => {
        this.user = userData;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
