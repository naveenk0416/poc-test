import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
    MatStepperModule
  ],
  templateUrl: './fir-registration.component.html',
  styleUrls: ['./fir-registration.component.css']
})
export class FirRegistrationComponent {
  firForm: FormGroup;
  isSubmitting = false;

  incidentTypes = [
    'Theft', 'Robbery', 'Assault', 'Cyber Crime', 'Kidnapping',
    'Fraud', 'Domestic Violence', 'Missing Person', 'Murder',
    'Property Damage', 'Vehicle Theft', 'Others'
  ];

  constructor(
    private fb: FormBuilder,
    private firService: FirService,
    private router: Router
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
      })
    });
  }

  onSubmit() {
    if (this.firForm.valid) {
      this.isSubmitting = true;
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
    } else {
      this.firForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
