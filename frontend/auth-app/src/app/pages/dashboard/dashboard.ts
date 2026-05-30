import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { FirService } from '../../core/fir.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  isLoading = true;
  error = '';

  allUsers: any[] = [];
  usersLoading = false;
  usersError = '';

  allFirs: any[] = [];
  firsLoading = false;
  firsError = '';

  // Calculate statistics
  totalFirs = 0;
  openCases = 0;
  closedCases = 0;

  userGroups = ['Citizen', 'Constable', 'SI', 'Inspector', 'ACP', 'Admin'];

  newUser = {
    name: '',
    email: '',
    password: '',
    gender: 'Male',
    userGroup: 'Citizen'
  };
  isCreatingUser = false;
  createUserError = '';
  createUserSuccess = '';

  constructor(
    private authService: AuthService,
    private firService: FirService
  ) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (userData) => {
        this.user = userData;
        this.isLoading = false;

        this.loadFirs();

        if (this.user.userGroup === 'Admin') {
          this.loadAllUsers();
        }
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.isLoading = false;
      }
    });
  }

  loadFirs(): void {
    this.firsLoading = true;
    this.firService.getFirs().subscribe({
      next: (firs) => {
        this.allFirs = firs;
        this.firsLoading = false;
        this.calculateStats();
      },
      error: (err) => {
        this.firsError = 'Failed to load FIR data';
        this.firsLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalFirs = this.allFirs.length;
    this.openCases = this.allFirs.filter(f => f.status !== 'Closed' && f.status !== 'Rejected').length;
    this.closedCases = this.allFirs.filter(f => f.status === 'Closed').length;
  }

  loadAllUsers(): void {
    this.usersLoading = true;
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.usersLoading = false;
      },
      error: (err) => {
        this.usersError = 'Failed to load users list';
        this.usersLoading = false;
      }
    });
  }

  onUserGroupChange(user: any, newGroup: string): void {
    this.authService.updateUserGroup(user._id, newGroup).subscribe({
      next: (updatedUser) => {
        user.userGroup = updatedUser.userGroup;
        alert(`Successfully updated user group for ${user.name}`);
      },
      error: (err) => {
        alert('Failed to update user group');
      }
    });
  }

  adminCreateUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.createUserError = 'Please fill out all required fields.';
      return;
    }

    this.isCreatingUser = true;
    this.createUserError = '';
    this.createUserSuccess = '';

    this.authService.adminCreateUser(this.newUser).subscribe({
      next: (res) => {
        this.isCreatingUser = false;
        this.createUserSuccess = `User ${res.name} created successfully.`;
        this.newUser = { name: '', email: '', password: '', gender: 'Male', userGroup: 'Citizen' };
        this.loadAllUsers(); // Refresh the list
      },
      error: (err) => {
        this.isCreatingUser = false;
        this.createUserError = err.error?.message || 'Failed to create user';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
