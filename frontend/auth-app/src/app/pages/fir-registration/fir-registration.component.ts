import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FirService } from '../../core/fir.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-fir-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './fir-registration.component.html',
  styleUrls: ['./fir-registration.component.css']
})
export class FirRegistrationComponent implements OnInit {
  firForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  firId: string | null = null;
  isLoading = false;

  incidentTypes = [
    'Theft', 'Robbery', 'Assault', 'Cyber Crime', 'Kidnapping',
    'Fraud', 'Domestic Violence', 'Missing Person', 'Murder',
    'Property Damage', 'Vehicle Theft', 'Others'
  ];

  firStatuses = [
    'Draft', 'Submitted', 'Registered', 'Assigned',
    'Investigation In Progress', 'Evidence Collected',
    'Charge Sheet Filed', 'Court Trial', 'Closed', 'Rejected'
  ];

  constructor(
    private fb: FormBuilder,
    private firService: FirService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.firForm = this.fb.group({
      policeStation: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      complainant: this.fb.group({
        fullName: ['', Validators.required],
        fatherOrHusbandName: [''],
        gender: [''],
        age: [''],
        mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', Validators.email],
        occupation: [''],
        addressLine1: [''],
        addressLine2: [''],
        city: [''],
        state: [''],
        pincode: ['']
      }),
      victim: this.fb.group({
        sameAsComplainant: [false],
        victimName: [''],
        gender: [''],
        age: [''],
        mobileNumber: [''],
        address: ['']
      }),
      incident: this.fb.group({
        incidentType: ['', Validators.required],
        occurrenceDate: ['', Validators.required],
        occurrenceTime: [''],
        placeOfOccurrence: ['', Validators.required],
        district: [''],
        state: [''],
        incidentDescription: ['', Validators.required],
        delayReason: ['']
      }),
      status: ['Submitted']
    });
  }

  ngOnInit(): void {
    this.firId = this.route.snapshot.paramMap.get('id');
    if (this.firId) {
      this.isEditMode = true;
      this.loadFirDetails();
    }
  }

  loadFirDetails() {
    this.isLoading = true;
    this.firService.getFirById(this.firId!).subscribe({
      next: (fir) => {
        this.firForm.patchValue(fir);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching FIR for edit:', err);
        alert('Could not load FIR details.');
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit() {
    if (this.firForm.valid) {
      this.isSubmitting = true;

      if (this.isEditMode) {
        this.firService.updateFir(this.firId!, this.firForm.value).subscribe({
          next: (res) => {
            this.isSubmitting = false;
            alert('FIR Updated successfully! FIR Number: ' + res.firNumber);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.isSubmitting = false;
            alert('Error updating FIR.');
            console.error(err);
          }
        });
      } else {
        this.firService.createFir(this.firForm.value).subscribe({
          next: (res) => {
            this.isSubmitting = false;
            alert('FIR Registered successfully! FIR Number: ' + res.firNumber);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.isSubmitting = false;
            alert('Error registering FIR.');
            console.error(err);
          }
        });
      }
    } else {
      this.firForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
