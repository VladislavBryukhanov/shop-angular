import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
// import moment from 'moment';
import * as moment from 'moment';
import { AuthService } from '../../services/auth/auth.service';
import { ContactInfo, User } from '../../types/user';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { filter, map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-sign',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, AfterContentInit, ErrorStateMatcher {

  public responsiveGridParams = {
    cols: 2,
    fxFlexOffset: 10
  };
  public hidePassword = true;
  public signUp: boolean;

  public email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  public password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(32)
  ]);

  public firstName = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(20)
  ]);
  public lastName = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(20)
  ]);
  public gender = new FormControl(null);
  public birthDay = new FormControl(null);

  public address = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(64)
  ]);
  public phone = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{4,12}$'),
  ]);

  public userForm = new FormGroup({
    email: this.email,
    password: this.password,
    firstName: this.firstName,
    lastName: this.lastName,
    gender: this.gender,
    birthDay: this.birthDay,

    contactInfo: new FormGroup({
      address: this.address,
      phone: this.phone
    })
  });

  public genderOptions = [
    {
      name: 'Male',
      value: true,
    },
    {
      name: 'Female',
      value: false,
    }
  ];

  public validation = {
    email: () => {
      if (this.email.hasError('email')) {
        return 'Please enter a valid email address';
      }
      if (this.email.hasError('required')) {
        return 'Email is required';
      }
    },
    password: () => this.validateTextField(this.password, 'Password', 8, 32),
    firstName: () => this.validateTextField(this.firstName, 'First name', 1, 20),
    lastName: () => this.validateTextField(this.lastName, 'Last name', 1, 20),
    address: () => this.validateTextField(this.address, 'Address', 4, 64),
    phone: () => {
      if (this.phone.hasError('pattern')) {
        return 'Wrong phone number format!';
      }
      if (this.email.hasError('required')) {
        return 'Phone number is required';
      }
    }
  };

  public gridByBreakpoint = {
    xl: {
      cols: 4,
      fxFlex: 46,
      fxFlexOffset: 28,
      rowHeight: '2:1',
    },
    lg: {
      cols: 4,
      fxFlex: 64,
      fxFlexOffset: 18,
      rowHeight: '2:1',
    },
    md: {
      cols: 3,
      fxFlex: 70,
      fxFlexOffset: 15,
      rowHeight: '2:1',
    },
    sm: {
      cols: 2,
      fxFlex: 80,
      fxFlexOffset: 10,
      rowHeight: '2:0.5',
    },
    xs: {
      cols: 1,
      fxFlex: 96,
      fxFlexOffset: 2,
      rowHeight: '2:0.5',
    }
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private mediaObserver: MediaObserver) { }

  ngAfterContentInit() {
    this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      ).subscribe((change: MediaChange) => {
        this.responsiveGridParams = this.gridByBreakpoint[change.mqAlias];
      });
  }

  ngOnInit() {
    this.route
      .data
      .subscribe(({ signUp }) => {
        this.signUp = signUp;
      });
  }

  isErrorState(control: FormControl | any, form: FormGroupDirective | NgForm | any): boolean {
    return control.invalid && (control.dirty || control.touched || form.submitted);
  }

  validateTextField(fc: FormControl, name: string, minLen: number, maxLen: number) {
    if (fc.hasError('required')) {
      return `${name} is required`;
    }
    if (fc.hasError('minlength')) {
      return `${name} must be longer then ${minLen - 1} characters`;
    }
    if (fc.hasError('maxlength')) {
      return `${name} must be less then ${maxLen + 1} characters`;
    }
  }

  onSignIn(e) {
    e.preventDefault();
    const { email, password } = this.userForm.value;
    this.authService.signIn({ email, password });
  }

  onSignUp(e) {
    e.preventDefault();
/*    const newUser: User = {
      ...this.userForm.value,
      birthDay: moment(this.userForm.value.birthDay)
        .unix()
        .toString()
    };
    const contactInfo: ContactInfo = {
      ...this.userForm.value.contactInfo
    };

    this.authService.signUp(newUser, contactInfo);*/
  }
}
